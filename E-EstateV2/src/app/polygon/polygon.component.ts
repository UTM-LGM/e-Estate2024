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




@Component({
  selector: 'app-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.css']
})
export class PolygonComponent implements OnInit {

  @Input() location!: [number, number];

  licenseNo = 'B/01/15730'
  // licenseNo = 'C/01/15701'


  graphicLayer!: GraphicsLayer
  map!: Map;
  view!: MapView


  simpleFillSymbol = {
    type: "simple-fill",
    color: [67, 103, 95, 0.5],
    outline: {
      color: [255, 255, 255],
      width: 1,
    },

  };

  constructor(
    private rrimGeoRubberService: RrimgeorubberIntegrationService,
    private spinnerService: SpinnerService
  ) {
    this.graphicLayer = new GraphicsLayer();
  }


  ngOnInit() {
    this.spinnerService.requestStarted()
    this.getGeoJson()
  }

  private initializeMap(): void {

    this.map = new Map({
      basemap: 'topo-vector'
    });

    this.view = new MapView({
      container: 'viewDiv',
      map: this.map,
      extent: new Extent({
        xmin: 99.5,
        ymin: 0.85,
        xmax: 119.3,
        ymax: 7.5,
      }),
      ui: {
        components: []
      },
    });

    this.map.add(this.graphicLayer);

    // Fetch and highlight the shape
    this.highlightShape(this.view);

  }

  getGeoJson() {
    this.rrimGeoRubberService.getGeoRubber(this.licenseNo)
      .subscribe(
        Response => {
          var features = Response.features;

          features.forEach((feature: any) => {
            let geometry = feature.geometry;
            // Check if the geometry is of type 'Polygon' or 'MultiPolygon'
            if (geometry.type === 'Polygon') {
              geometry.coordinates.forEach((coordinateSet: any) => {
                this.addLayerGeojson(coordinateSet);
              });
            } else if (geometry.type === 'MultiPolygon') {
              geometry.coordinates.forEach((polygonCoordinates: any) => {
                polygonCoordinates.forEach((coordinateSet: any) => {
                  this.addLayerGeojson(coordinateSet);
                });
              });
            }

          });

          this.initializeMap()

          this.view.when(() => {
            if (this.graphicLayer.graphics.length > 0) {
              this.view.goTo(this.graphicLayer.graphics);
              this.spinnerService.requestEnded()
            }
          });
        }
      )
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

}
