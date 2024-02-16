import { Estate } from "./estate";
import { Ownership } from "./ownership";
import { Town } from "./town";

export interface Company {
    id: number
    companyName: string
    address1: string
    address2: string
    address3: string
    postcode: string
    towns: Town[]
    townId: number
    state: string
    stateId: number
    ownerships:Ownership[]
    ownershipId:number
    phone: string
    email: string
    fax: string
    contactNo: string
    managerName: string
    isActive: boolean
    estates: Estate[]
    townEstate: string
    membershipType: string
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
}