/**
 * @description base64 to blob
 */
export function base64ToBlob(base64String: string) {
  return new Promise<Blob>((resolve, reject) => {
    try {
      const arr = base64String.split(',')
      const typeItem = arr[0]
      const mime = typeItem.match(/:(.*?);/)![1]
      // https://www.runoob.com/jsref/met-win-atob.html
      const bstr = window.atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--)
        u8arr[n] = bstr.charCodeAt(n)

      resolve(new Blob([u8arr], { type: mime }))
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * @description blob to base64
 */
export function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = (e) => {
      resolve(e.target!.result as string)
    }
    fr.onerror = reject
    fr.readAsDataURL(blob)
  })
}

/**
 * @description img url to base64
 */
export function imgUrlToBase64(url: string, mineType = 'image/png') {
  return new Promise<string>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = url

    img.onload = function () {
      let canvas: HTMLCanvasElement | null = document.createElement('canvas')!
      const ctx = canvas.getContext('2d')!
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL(mineType))
      canvas = null
    }

    img.onerror = function () {
      console.error('Failed to load image')
      reject(new Error('imgUrlToBase64 error'))
    }
  })
}
