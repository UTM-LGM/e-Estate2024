import { Estate } from "./estate";

export interface CostAmount {
    id: number
    costId: number
    amount: number
    year: number
    estates: Estate[]
    estateId: number
    costSubcategory1Id: number
    costSubcategory1: string
    costSubcategory2: string
    costType: string
    costTypeId: number
    isMature: boolean
    status: string
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
}