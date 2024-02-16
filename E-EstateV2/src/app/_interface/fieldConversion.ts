import { FieldStatus } from "./fieldStatus";

export interface FieldConversion {
    id: number
    conversionCropName: string
    sinceYear: number | null
    fieldId: number
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    fieldStatuses: FieldStatus[]
    fieldName: string
    isActive: boolean
}