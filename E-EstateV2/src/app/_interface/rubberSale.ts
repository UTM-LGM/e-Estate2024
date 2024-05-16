import { Buyer } from "./buyer"

export interface RubberSale {
    id: number
    saleDateTime: Date
    rubberType: string
    letterOfConsentNo: string
    // receiptNo: string
    wetWeight: number
    drc: number
    unitPrice: number
    //total:string
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
    transportPlateNo:string
    paymentStatusId:number
    paymentStatus : string,
    buyerLicenseNo:string
    driverName:string
    remark:string
    deliveryAgent:string
}