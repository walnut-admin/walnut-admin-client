export function wbtoa(a: string) {
  try {
    return window.btoa(unescape(encodeURIComponent(a)))
  }
  catch {
    return a
  }
}
export function watob(a: any) {
  try {
    return decodeURIComponent(escape(window.atob(a)))
  }
  catch {
    return a
  }
}
