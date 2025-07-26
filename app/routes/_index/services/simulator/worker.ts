import { expose } from 'comlink'
import { simulate } from './simulator'

expose(simulate)

export type WorkerAPI = typeof simulate
