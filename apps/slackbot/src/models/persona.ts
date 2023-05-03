import { Capability } from "./capability"

export interface Persona {
    key?: string
    name: string
    description?: string
    organizationKey: string
    capabilities: Capability[]
}