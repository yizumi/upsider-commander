import { Capability } from "./capability"

export interface App {
    key?: string
    organizationKey: string
    name: string
    capabilities?: Capability[]
}