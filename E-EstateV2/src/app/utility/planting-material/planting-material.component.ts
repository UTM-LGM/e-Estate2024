import { Component, OnInit } from '@angular/core';
import { PlantingMaterial } from 'src/app/_interface/planting-material';
import { PlantingMaterialService } from 'src/app/_services/planting-material.service';
import { SharedService } from 'src/app/_services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-planting-material',
  templateUrl: './planting-material.component.html',
  styleUrls: ['./planting-material.component.css']
})
export class PlantingMaterialComponent implements OnInit {

  term = ''
  pageNumber = 1
  order = ''
  currentSortedColumn = ''
  isLoading = true

  plantingMaterial: PlantingMaterial = {} as PlantingMaterial

  plantingMaterials: PlantingMaterial[] = []

  sortableColumns = [
    { columnName: 'plantingMaterial', displayText: 'Planting Material' },
  ];

  constructor(
    private sharedService: SharedService,
    private plantingMaterialService: PlantingMaterialService
  ) { }

  ngOnInit(): void {
    this.plantingMaterial.plantingMaterial = ''
    this.getPlantingMaterial()
  }

  getPlantingMaterial() {
    setTimeout(() => {
      this.plantingMaterialService.getPlantingMaterial()
        .subscribe(
          Response => {
            this.plantingMaterials = Response
            this.isLoading = false
          }
        )
    })
  }

  submit() {
    if (this.plantingMaterial.plantingMaterial === '') {
      swal.fire({
        text: 'Please fill up the form',
        icon: 'error'
      });
    } else if (this.plantingMaterials.some(p => p.plantingMaterial.toLowerCase() === this.plantingMaterial.plantingMaterial.toLowerCase())) {
      swal.fire({
        text: 'State already exists!',
        icon: 'error'
      });
    } else {
      this.plantingMaterial.isActive = true
      this.plantingMaterial.createdBy = this.sharedService.userId.toString()
      this.plantingMaterial.createdDate = new Date()
      this.plantingMaterialService.addPlantingMaterial(this.plantingMaterial)
        .subscribe(
          Response => {
            swal.fire({
              title: 'Done!',
              text: 'Planting Material successfully submitted!',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.reset()
            this.ngOnInit()
          }
        )
    }
  }

  reset() {
    this.plantingMaterial = {} as PlantingMaterial
  }

  toggleSort(columnName: string) {
    if (this.currentSortedColumn === columnName) {
      this.order = this.order === 'asc' ? 'desc' : 'asc'
    } else {
      this.currentSortedColumn = columnName;
      this.order = this.order === 'desc' ? 'asc' : 'desc'
    }
  }

  status(plantingMaterial: PlantingMaterial) {
    plantingMaterial.updatedBy = this.sharedService.userId.toString()
    plantingMaterial.updatedDate = new Date()
    plantingMaterial.isActive = !plantingMaterial.isActive
    this.plantingMaterialService.updatePlantingMaterial(plantingMaterial)
      .subscribe(
        Response => {
          swal.fire({
            title: 'Done!',
            text: 'Status successfully updated!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.ngOnInit()
        }
      )
  }
}
