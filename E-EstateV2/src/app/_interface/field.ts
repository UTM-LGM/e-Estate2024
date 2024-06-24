import { Clone } from "./clone";
import { FieldStatus } from "./fieldStatus";

export interface Field {
    percentage: number;
    id: number
    fieldName: string
    area: number
    isActive: boolean
    isMature: boolean | null
    dateOpenTapping: string | null
    dateOpenTappingFormatted: string
    totalTask: number
    estateId: number
    cloneId: number
    clone: string
    fieldStatusId: number
    fieldStatuses: FieldStatus[]
    fieldStatus: string
    yearPlanted: string
    otherCrop: string
    cloneName: string
    clones: Clone[]
    initialTreeStand: number
    tappingSystem: string
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    conversionCropName: string
    sinceYear: number | null
    fieldId: number
    conversionId: number
    fieldDiseaseId:number
    areaInfected:number
    estate:any
    otherCropId:number
    companyId:number
    rubberArea:number | null
    remark:string
    currentTreeStand:number
    
}