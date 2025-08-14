export function requestInterceptorsCatch(err: Error) {
  return Promise.reject(err)
}
