export interface ProductionComparison {
    id: number
    estateId: number
    createdYear: number
    previousYear: string
    previousYearDry: number
    currentYearDry: number
    currentYear: string
    productionComparison: string
    reason: string
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
}