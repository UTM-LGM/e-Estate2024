import { Buyer } from "./buyer"

export interface RubberSale {
    id: number
    saleDateTime: string
    rubberType: string
    letterOfConsentNo: string
    receiptNo: string
    wetWeight: number
    drc: number
    unitPrice: number
    total:number
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
    paymentStatus : string | null,
    buyerLicenseNo:string
    driverName:string
    remark:string
    deliveryAgent:string
    driverIc:string
    receiptNoDate:string
    weightSlipNo:string
    weightSlipNoDate:string
    buyerDRC:number
    buyerWetWeight:number
    licenseNoTrace:string
    msnrStatus:boolean
    polygonArea:number
}