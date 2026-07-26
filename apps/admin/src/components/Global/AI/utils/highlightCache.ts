import { FORMAT_CACHE_MAX } from '../config/constants'
import { LRUMap } from './cache'

export const highlightCache = new LRUMap<string, string>(FORMAT_CACHE_MAX)
