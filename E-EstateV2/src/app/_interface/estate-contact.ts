import { Estate } from "./estate"

export interface EstateContact {
    id:number
    name:string
    position:string
    phoneNo:string
    email:string
    isActive:boolean
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    estateId:number
    estate:Estate[]
}