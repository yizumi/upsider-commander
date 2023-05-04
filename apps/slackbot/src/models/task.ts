import {Capability} from "./capability";

export interface Task {
  title: string
  details: string
  capability: Capability,
  status?: 'in-progress' | 'completed'
  startTime?: Date
  endTime?: Date
}
