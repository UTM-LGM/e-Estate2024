import { CostCategory } from "./costCategory"
import { CostSubcategory1 } from "./costSubcategory1"
import { CostSubcategory2 } from "./costSubcategory2"
import { CostType } from "./costType"

export interface Cost {
    id: number
    isMature: boolean
    isActive: Boolean
    costTypeId: number
    costType: string
    costTypes: CostType[]
    costCategoryId: number
    costCategory: string
    costCategories: CostCategory[]
    costSubcategory1Id: number
    costSubcategory1: string
    costSubcategories1: CostSubcategory1[]
    costSubcategory2Id: number
    costSubcategory2: string
    costSubcategories2: CostSubcategory2[]
    amount: number | null
    monthYear: string
    estateId: number
    name: string
    status: string
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
}