import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { PlantingMaterial } from '../_interface/planting-material';

@Injectable({
  providedIn: 'root'
})
export class PlantingMaterialService {
  baseUrl = environment.apiUrl

  constructor(private http:HttpClient) { }

  getPlantingMaterial():Observable<PlantingMaterial[]>{
    return this.http.get<PlantingMaterial[]>(this.baseUrl + '/plantingMaterials/GetPlantingMaterial')
  }

  addPlantingMaterial(plantingMaterial:PlantingMaterial):Observable<PlantingMaterial>{
    return this.http.post<PlantingMaterial>(this.baseUrl + '/plantingMaterials/AddPlantingMaterial', plantingMaterial)
  }

  updatePlantingMaterial(plantingMaterial:PlantingMaterial):Observable<PlantingMaterial>{
    return this.http.put<PlantingMaterial>(this.baseUrl + '/plantingMaterials/UpdatePlantingMaterial', plantingMaterial)
  }
}
