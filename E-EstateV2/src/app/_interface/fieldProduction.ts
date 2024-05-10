export interface FieldProduction {
    id: number
    monthYear: string | null
    cuplump: number | null
    cuplumpDRC: number | null
    latex: number | null
    latexDRC: number | null
    uss: number | null
    ussDRC: number | null
    others: number | null
    othersDRC: number | null
    noTaskTap: number | null
    noTaskUntap: number | null
    fieldName: string
    fieldId: number
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    remarkUntap: string
    totalTask: number
    estateId: number
    totalProduction: number
    totalCuplump: number
    totalLatex: number
    cuplumpDry: number
    latexDry: number
    ussDry: number
    othersDry: number
    tappedAreaPerHa: number
    isAcive: boolean
    status:string
    totalDry:number
}