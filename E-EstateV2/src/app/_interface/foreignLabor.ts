import { Country } from "./country";

export interface ForeignLabor {
    id: number
    monthYear: string | null
    tapperCheckrole: number | null
    tapperContractor: number | null
    fieldCheckrole: number | null
    fieldContractor: number | null
    countryId: number
    countryName: string
    country: Country[]
    isLocal: boolean
    total: number
    workerNeeded: number | null
    estateId: number
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    totalLaborWorker: number
}