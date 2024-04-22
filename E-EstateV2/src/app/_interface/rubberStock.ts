export interface RubberStock{
    id:number
    monthYear:string
    totalProduction:number
    totalSale:number
    currentStock:number
    waterLoss:number
    estateId:number
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    previousStock:number
    isActive:Boolean
}