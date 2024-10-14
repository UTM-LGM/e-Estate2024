export interface FieldInfected{
    id:number
    fieldDiseaseId:number
    fieldId:number
    fieldName:string
    area:number
    areaInfected:number
    dateScreening:Date
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    remark:string
    isActive:boolean
    areaAffected:number
    severityLevel:string
    dateRecovered:Date
}