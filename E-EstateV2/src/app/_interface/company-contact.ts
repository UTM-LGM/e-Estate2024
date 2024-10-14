import { Company } from "./company"

export interface CompanyContact {
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
    companyId:number
    company:Company[]
}