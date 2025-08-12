import { expose } from 'comlink'
import { simulate } from './simulator'

const WORKER_EXPOSED_API = simulate

expose(WORKER_EXPOSED_API)

export type WorkerAPI = typeof WORKER_EXPOSED_API
