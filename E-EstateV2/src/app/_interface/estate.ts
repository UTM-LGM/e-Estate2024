import { FieldStatus } from "./fieldStatus";
import { Establishment } from "./establishment";
import { Field } from "./field";
import { FinancialYear } from "./financialYear";
import { Town } from "./town";
import { PlantingMaterial } from "./planting-material";

export interface Estate {
    id: number
    companyId: number
    companyName: string
    estateName: string
    address1: string
    address2: string
    address3: string
    postcode: string
    phone: string
    fax: string
    email: string
    licenseNo: string
    totalArea: string
    towns: Town[]
    town1: string
    townId: number
    stateId: number
    state: string
    financialYearId: number
    financialYear: string
    financialYears: FinancialYear[]
    establishmentId: number
    establishments: Establishment[]
    establishment: string
    membershipTypeId: number
    membership: string
    isActive: boolean
    managerName: string
    fields: Field[]
    clone: string
    fieldStatus: string
    cropCategories: FieldStatus[]
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    latitudeLongitude: string
    plantingMaterialId:number
    plantingMaterial:PlantingMaterial[]
    grantNo:string
}