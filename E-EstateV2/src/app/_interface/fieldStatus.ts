export interface FieldStatus {
    fieldStatusId: number
    id: number
    fieldStatus: string
    isMature: boolean | null
    rubberType: string
    isActive: boolean
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
}