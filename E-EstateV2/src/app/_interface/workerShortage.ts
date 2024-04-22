export interface WorkerShortage{
    id:number
    monthYear:string | null
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
    estateId: number
    tapperWorkerShortage:number
    fieldWorkerShortage:number
    // neededTapper:number
    // neededField:number
}