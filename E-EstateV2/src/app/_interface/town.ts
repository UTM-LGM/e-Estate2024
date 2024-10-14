import { State } from "./state"

export interface Town {
    id: number
    town: string
    stateId: number
    state: string
    states: State[]
    isActive: boolean
    createdBy: string
    createdDate: Date
    updatedBy: string
    updatedDate: Date
}