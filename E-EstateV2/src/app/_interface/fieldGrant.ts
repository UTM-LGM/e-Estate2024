export interface FieldGrant {
    id:number
    grantTitle:string
    grantArea:number | null
    grantRubberArea:number | null
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    fieldId:number
}