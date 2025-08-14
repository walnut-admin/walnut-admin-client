import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { debounce } from 'lodash-es'

/**
 * @description generated and optimised by doubao
 */

// Interface for pending requests
interface PendingRequest {
  config: InternalAxiosRequestConfig
  resolve: (value: AxiosResponse<any>) => void
  reject: (reason?: any) => void
  // Original parameters used to map results from merged response
  originalParams: Record<string, any>
}

// Grouped pending requests
type RequestGroup = Map<string, PendingRequest[]>

const DEFAULT_DELAY = 50 // Delay in milliseconds before merging requests
const requestGroups = shallowRef(new Map<string, RequestGroup>())

/**
 * Merge multiple request parameters into a single parameter object
 * Values of the same parameter key will be joined with commas
 * @param paramsList List of parameter objects to merge
 * @returns Merged parameter object
 */
function mergeRequestParams(paramsList: Record<string, any>[]): Record<string, any> {
  const merged: Record<string, any> = {}

  // Iterate through all request parameters
  paramsList.forEach((params) => {
    Object.entries(params).forEach(([key, value]) => {
      // If parameter key already exists, join values with comma
      if (merged[key] !== undefined) {
        // Ensure values are arrays to avoid duplicate entries
        const existingValues = Array.isArray(merged[key]) ? merged[key] : [merged[key]]
        const newValue = Array.isArray(value) ? value : [value]

        // Merge and deduplicate values
        merged[key] = [...new Set([...existingValues, ...newValue])].join(',')
      }
      else {
        // New parameter key, set directly
        merged[key] = value
      }
    })
  })

  return merged
}

/**
 * Distribute merged response data back to individual requests
 * @param mergedResponse The response from merged request
 * @param requests List of original requests
 */
function distributeResponse(mergedResponse: AxiosResponse, requests: PendingRequest[]) {
  // This should be adjusted according to actual API response format
  // Assume API returns data in format { [paramValue]: responseData }
  const responseData = mergedResponse.data

  requests.forEach((request) => {
    // Construct result based on original request parameters
    let result = null

    // Try to find matching data from merged response
    Object.entries(request.originalParams).forEach(([_, value]) => {
      // Simple matching logic, should be adjusted based on API response format
      if (responseData[value]) {
        result = responseData[value]
      }
    })

    // If no matching result found, use the entire merged response
    if (!result) {
      result = mergedResponse.data
    }

    // Create a new response object with original response properties but replaced data
    const responseForRequest: AxiosResponse = {
      ...mergedResponse,
      data: result,
    }

    // Resolve the original request's promise
    request.resolve(responseForRequest)
  })
}

/**
 * Schedule a debounced merged request
 * @param groupKey Key for the request group
 * @param group Request group
 * @param originalAdapter Original axios adapter
 */
const scheduleMergeRequest = debounce((groupKey: string, group: RequestGroup, originalAdapter: AxiosAdapter) => {
  // Merge all requests in the group
  const allRequests = Array.from(group.values()).flat()

  // Merge parameters
  const mergedParams = mergeRequestParams(allRequests.map(r => r.originalParams))

  // Create merged request configuration
  const mergedConfig: InternalAxiosRequestConfig = {
    ...allRequests[0].config,
    params: mergedParams,
  }

  // Send merged request
  originalAdapter(mergedConfig)
    .then((response) => {
      // Distribute merged response to individual requests
      distributeResponse(response, allRequests)
    })
    .catch((error) => {
      // Reject all requests on error
      allRequests.forEach(request => request.reject(error))
    })
    .finally(() => {
      // Clean up processed request group
      requestGroups.value.delete(groupKey)
    })
}, DEFAULT_DELAY)

/**
 * Axios adapter that merges multiple requests with same URL and method
 * into a single request by combining parameters with comma-separated values
 * @param adapter Original axios adapter
 * @returns Enhanced adapter with request merging capability
 */
export function mergeAdapter(adapter: AxiosAdapter): AxiosAdapter {
  return async (config: InternalAxiosRequestConfig) => {
    const { url, method, params, _mergeRequest } = config

    // If request merging is disabled or not a GET request, execute original request
    if (!_mergeRequest || method?.toLowerCase() !== 'get') {
      return adapter(config)
    }

    // Generate request group key (URL + method)
    const groupKey = `${url}|${method}`

    // Get or create request group
    if (!requestGroups.value.has(groupKey)) {
      requestGroups.value.set(groupKey, new Map())
    }
    const group = requestGroups.value.get(groupKey)!

    // Generate parameter signature to distinguish different parameter combinations
    const paramsSignature = JSON.stringify(params || {})

    // Get or create parameter group
    if (!group.has(paramsSignature)) {
      group.set(paramsSignature, [])
    }
    const paramGroup = group.get(paramsSignature)!

    // Create a promise to wait for merged request result
    return new Promise((resolve, reject) => {
      // Add current request to pending queue
      paramGroup.push({
        config,
        resolve,
        reject,
        originalParams: params || {},
      })

      // Trigger debounced merged request
      scheduleMergeRequest(groupKey, group, adapter)
    })
  }
}
