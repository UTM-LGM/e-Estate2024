export interface Announcement {
    id: number
    tittle: string
    fileUpload: File | null
    isActive: boolean
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    filePath: string
    hierarchy:number
}