import { Persona } from "./persona"
import { User } from "./user"

export interface Organization {
    key: string
    name: string
    users?: User[]
    personas?: Persona[]
}