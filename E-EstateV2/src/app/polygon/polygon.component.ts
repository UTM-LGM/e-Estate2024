import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RrimgeorubberIntegrationService } from '../_services/rrimgeorubber-integration.service';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from '@arcgis/core/geometry/Polygon';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Extent from "@arcgis/core/geometry/Extent";
import Point from '@arcgis/core/geometry/Point'; // Import Point
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import { SpinnerService } from '../_services/spinner.service';
import { SharedService } from '../_services/shared.service';
import { MyLesenIntegrationService } from '../_services/my-lesen-integration.service';
import { SubscriptionService } from '../_services/subscription.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.css']
})
export class PolygonComponent implements OnInit {

  @Input() location!: [number, number];

  graphicLayer!: GraphicsLayer
  map!: Map;
  view!: MapView
  role = ''
  selectedEstateName = ''

  simpleFillSymbol = {
    type: "simple-fill",
    color: [67, 103, 95, 0.5],
    outline: {
      color: [255, 255, 255],
      width: 1,
    },

  };

  polygonArea: number[] = []
  polygonTotalArea = 0

  estate: any = {} as any
  company: any = {} as any
  filterLGMAdmin: any[] = []
  filterCompanyAdmin: any[] = []
  companies: any[] = []

  malaysiaExtent = new Extent({
    xmin: 99.5,
    ymin: 0.85,
    xmax: 119.3,
    ymax: 7.5,
  });


  constructor(
    private rrimGeoRubberService: RrimgeorubberIntegrationService,
    private spinnerService: SpinnerService,
    private sharedService: SharedService,
    private myLesenService: MyLesenIntegrationService,
    private subscriptionService: SubscriptionService



  ) {
    this.graphicLayer = new GraphicsLayer();
  }


  ngOnInit() {
    // this.spinnerService.requestStarted()
    setTimeout(() => {
      this.getGeoJson();
    }, 0); // Delaying to ensure the DOM element is available
    this.role = this.sharedService.role
    this.getAllCompanies()
    if (this.role == "CompanyAdmin") {
      this.estate.companyId = this.sharedService.companyId
      this.getAllEstate()
      this.getCompany()
    }
    else if (this.role == "EstateClerk") {
      this.estate.id = this.sharedService.estateId
      this.getEstate()
    }
  }


  getAllEstate() {
    const getAllEstate = this.myLesenService.getAllEstate()
      .subscribe(
        Response => {
          this.filterLGMAdmin = Response.filter(x => x.companyId == this.estate.companyId)
          this.filterCompanyAdmin = Response.filter(x => x.companyId == this.estate.companyId)
        }
      )
    this.subscriptionService.add(getAllEstate);

  }

  getEstate() {
    const getOneEstate = this.myLesenService.getOneEstate(this.estate.id)
      .subscribe(
        Response => {
          this.estate = Response
          this.getGeoJson();

        }
      )
    this.subscriptionService.add(getOneEstate);

  }

  getAllCompanies() {
    const getAllCompany = this.myLesenService.getAllCompany()
      .subscribe(
        Response => {
          this.companies = Response
        }
      )
    this.subscriptionService.add(getAllCompany);

  }

  getCompany() {
    const getCompany = this.myLesenService.getOneCompany(this.estate.companyId)
      .subscribe(
        Response => {
          this.company = Response
        }
      )
    this.subscriptionService.add(getCompany);

  }

  companySelected() {
    this.estate.licenseNo = ''
    this.polygonArea = []
    this.polygonTotalArea = 0
    if (this.view) {
      this.graphicLayer.removeAll()
      this.view.extent = this.malaysiaExtent;
    }
    this.getAllEstate()

  }


  estateSelected() {
    this.selectedEstateName = this.filterLGMAdmin.find(e => e.id === this.estate.id)?.name || '';
    this.getGeoJson()
  }

  private initializeMap(): void {
    if (!this.view) {
      this.map = new Map({
        basemap: 'hybrid'
      });

      this.view = new MapView({
        container: 'viewDiv',
        map: this.map,
        extent: this.malaysiaExtent,
        ui: {
          components: []
        },
      });

      this.map.add(this.graphicLayer);

      // Fetch and highlight the shape
      this.highlightShape(this.view);
      this.spinnerService.requestEnded()
    }

  }

  getGeoJson() {
    this.spinnerService.requestStarted()
    if (this.estate.licenseNo != undefined) {
      this.rrimGeoRubberService.getGeoRubber(this.estate.licenseNo)
        .subscribe(
          Response => {
            var features = Response.features;
            if (features != undefined) {
              features.forEach((feature: any) => {
                let geometry = feature.geometry;
                let properties = feature.properties
                // Check if the geometry is of type 'Polygon' or 'MultiPolygon'
                if (geometry.type === 'Polygon') {
                  geometry.coordinates.forEach((coordinateSet: any) => {
                    this.addLayerGeojson(coordinateSet);
                    this.polygonArea.push(properties.hectarage_of_marked_polygon);
                  });
                } else if (geometry.type === 'MultiPolygon') {
                  geometry.coordinates.forEach((polygonCoordinates: any) => {
                    polygonCoordinates.forEach((coordinateSet: any) => {
                      this.addLayerGeojson(coordinateSet);
                      this.polygonArea.push(properties.hectarage_of_marked_polygon);
                    });
                  });
                }
              });
            } else {
              this.spinnerService.requestEnded()
              swal.fire({
                text: 'Polygon is not listed in RRIM GeoRubber',
                icon: 'error'
              });
            }

            this.initializeMap()

            this.polygonTotalArea = this.polygonArea.reduce((acc, currentValue) => acc + currentValue, 0);

            this.view.when(() => {
              if (this.graphicLayer.graphics.length > 0) {
                this.view.goTo(this.graphicLayer.graphics);
                this.spinnerService.requestEnded()
              }
            });
          }
        )
    }
    else {
      setTimeout(() => {
        this.initializeMap();
      }, 2000);
    }
  }

  addLayerGeojson(data: any) {
    const polygonGraphic = this.createPolygonGraphic(data);
    this.graphicLayer.add(polygonGraphic);
  }

  createPolygonGraphic(data: any): Graphic {
    return new Graphic({
      geometry: new Polygon({
        rings: data,
      }),
      symbol: this.simpleFillSymbol,
    });
  }

  private highlightShape(view: MapView): void {
    const polygon = new Polygon({
      hasZ: false,
      hasM: false,
      rings: [
        [
          [-118.818984489994, 34.0137559967283],
          [-118.806796597377, 34.0215816298725],
          [-118.791432890735, 34.0163883241613],
          [-118.79596686535, 34.008564864635],
          [-118.808558110679, 34.0035027131376],
          [-118.818984489994, 34.0137559967283]
        ]
      ]
    });
    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: this.createPolygonSymbol()
    });

    view.graphics.add(polygonGraphic);
  }

  private createPolygonSymbol(): SimpleFillSymbol {
    return new SimpleFillSymbol({
      color: [51, 51, 204, 0.5],
      style: 'solid',
      outline: new SimpleLineSymbol({
        color: 'cyan',
        width: 2
      })
    });
  }

  zoomIn() {
    if (this.view) {
      this.view.zoom += 1; // Zoom in
    }
  }

  zoomOut() {
    if (this.view) {
      this.view.zoom -= 1; // Zoom out
    }
  }

}
