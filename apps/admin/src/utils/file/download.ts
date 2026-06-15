import { base64ToBlob, imgUrlToBase64 } from '@/utils/file/base64'

/**
 * @description Download url resources
 */
export function downloadByUrl(url: string, fileName?: string, target: '_self' | '_blank' = '_blank') {
  return new Promise<boolean>((resolve, reject) => {
    if (/(iP)/.test(window.navigator.userAgent))
      reject(new Error('Your browser does not support download!'))

    try {
      const a = document.createElement('a')
      a.href = url
      a.target = target
      a.style.display = 'none'

      a.download
        = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      resolve(true)
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * @description Download blob resources
 */
export async function downloadByBlob(data: Blob, fileName?: string) {
  const tempBlobURL = URL.createObjectURL(data)

  await downloadByUrl(tempBlobURL, fileName)

  URL.revokeObjectURL(tempBlobURL)
}

/**
 * @description Download base64 resources
 */
export async function downloadByBase64(base64: string, fileName?: string) {
  const blob = await base64ToBlob(base64)

  await downloadByBlob(blob, fileName)
}

/**
 * @description Download online url resources
 */
export async function downloadByOnlineUrl(url: string, fileName?: string) {
  const base64 = await imgUrlToBase64(url)

  await downloadByBase64(base64, fileName)
}
