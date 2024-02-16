import { Buyer } from "./buyer"

export interface RubberSale {
    id: number
    date: Date
    rubberType: string
    authorizationLetter: string
    receiptNo: string
    weight: number
    drc: number
    amountPaid: number
    isActive: boolean
    buyerId: number
    buyer: Buyer[]
    buyerName: string
    companyId: number
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    estateId: number
}