import { LaborInformation } from "./laborInformation"

export interface LocalLabor {
    id: number
    monthYear: string | null
    totalWorker: number | null
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    laborTypeId: number
    laborTypeName: string
    laborType: LaborInformation[]
    estateId: number
    totalLaborWorker: number
}