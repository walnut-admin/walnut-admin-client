// try to use https://vueuse.org/core/useObjectUrl
// below is just a copy
export function useBlob() {
  const URL = window.URL || window.webkitURL

  const tempBlobURL = shallowRef<string>()

  const destroyBlobUrl = () => {
    if (tempBlobURL.value) {
      URL.revokeObjectURL(tempBlobURL.value)
    }
    tempBlobURL.value = undefined
  }

  const createBlobUrl = (b: Blob) =>
    new Promise<string>((resolve, reject) => {
      try {
        destroyBlobUrl()
        tempBlobURL.value = URL.createObjectURL(b)
        resolve(tempBlobURL.value)
      }
      catch (error) {
        reject(error)
      }
    })

  tryOnUnmounted(destroyBlobUrl)

  return {
    tempBlobURL,
    createBlobUrl,
    destroyBlobUrl,
  }
}
