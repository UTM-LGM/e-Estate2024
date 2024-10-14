import { Seller } from "./seller"

export interface RubberPurchase {
    id: number
    date: Date
    project: string
    rubberType: string
    authorizationLetter: string
    weight: number
    drc: number
    price: number
    isActive: boolean
    sellerId: number
    seller: Seller[]
    sellerName: string
    companyId: number
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    estateId: number
    totalPrice:number
}