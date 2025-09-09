import type { UploadFileInfo } from 'naive-ui'
import OSS from 'ali-oss'
import { omit } from 'lodash-es'
import { getAliSTSTokenAPI } from '@/api/shared/ali'

export class AliOSSClient {
  private static _instance: AliOSSClient

  private static config: OSS.Options
  private static client: OSS
  private static checkPoint: OSS.Checkpoint | null

  private constructor() {
    if (AliOSSClient._instance)
      throw new Error('Use AliOSSClient.instance instead of new.')
    AliOSSClient._instance = this
  }

  static get instance() {
    return (
      AliOSSClient._instance ?? (AliOSSClient._instance = new AliOSSClient())
    )
  }

  public async getConfig() {
    if (AliOSSClient.config)
      return AliOSSClient.config
    const config = await getAliSTSTokenAPI()
    AliOSSClient.config = {
      ...config,
      refreshSTSTokenInterval: 30 * 60 * 1000, // 30 min
      refreshSTSToken: async () => {
        const newConfig = await getAliSTSTokenAPI()
        return omit(newConfig, ['bucket', 'region'])
      },
    }
    return AliOSSClient.config
  }

  public async getClient() {
    if (AliOSSClient.client)
      return AliOSSClient.client
    const config = await this.getConfig()
    AliOSSClient.client = new OSS(config)
    return AliOSSClient.client
  }

  /* get full ali oss url base on passed in value */
  public getFullUrl(value: string) {
    return `https://${AliOSSClient.config.bucket}.${AliOSSClient.config.region}.aliyuncs.com/${value}`
  }

  /* simple upload */
  public async upload(
    data: UploadFileInfo,
    folder: string,
  ): Promise<{ id: string, value: string } | undefined> {
    const headers = {
      // 指定该Object被下载时网页的缓存行为。
      // 'Cache-Control': 'no-cache',
      // 指定该Object被下载时的名称。
      'Content-Disposition': encodeURIComponent(data.name),
      // 指定该Object被下载时的内容编码格式。
      // 'Content-Encoding': 'UTF-8',
      // 指定过期时间。
      //   Expires: new Date(new Date().getTime() + 1000).toUTCString(),
      // 指定Object的存储类型。
      // 'x-oss-storage-class': 'Standard',
      // 指定Object的访问权限。
      // 'x-oss-object-acl': 'private',
      // 设置Object的标签，可同时设置多个标签。
      // 'x-oss-tagging': 'Tag1=1&Tag2=2',
      // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
      'x-oss-forbid-overwrite': false,
    }

    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
    // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
    try {
      const client = await this.getClient()

      const result = await client.put(`${folder}/${data.name}`, data.file, {
        headers,
      })

      return {
        id: data.id,
        value: result.name,
      }
    }
    catch (error: any) {
      if (error.name === 'FileAlreadyExistsError')
        useAppMessage().error('File Already Exists')
    }
  }

  /* ali oss multipart upload, normally used for large files */
  public async multiUpload(
    data: UploadFileInfo,
    folder: string,
    onProcessCallback: (e: { percent: number }) => void,
  ): Promise<{ id: string, value: string } | undefined> {
    const headers = {
      // 指定该Object被下载时网页的缓存行为。
      // 'Cache-Control': 'no-cache',
      // 指定该Object被下载时的名称。
      'Content-Disposition': encodeURIComponent(data.name),
      // 指定该Object被下载时的内容编码格式。
      // 'Content-Encoding': 'UTF-8',
      // 指定过期时间。
      //   Expires: new Date(new Date().getTime() + 1000).toUTCString(),
      // 指定Object的存储类型。
      // 'x-oss-storage-class': 'Standard',
      // 指定Object的访问权限。
      // 'x-oss-object-acl': 'private',
      // 设置Object的标签，可同时设置多个标签。
      // 'x-oss-tagging': 'Tag1=1&Tag2=2',
      // 指定CopyObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
      'x-oss-forbid-overwrite': false,
    }

    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
    // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
    try {
      const client = await this.getClient()

      const result = await client.multipartUpload(
        `${folder}/${data.name}`,
        data.file,
        {
          headers,
          checkpoint: AliOSSClient.checkPoint!,
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, _res) => {
            AliOSSClient.checkPoint = cpt
            onProcessCallback({ percent: Math.ceil(p * 100) })
          },
          // 设置并发上传的分片数量。
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: data.type!,
        },
      )

      return {
        id: data.id,
        value: result.name,
      }
    }
    catch (error: any) {
      console.log(error.name)

      if (error.name === 'FileAlreadyExistsError')
        useAppMessage().error('File Already Exists')

      if (error.name === 'cancel')
        useAppMessage().error('Canceled')

      if (error.name === 'abort')
        useAppMessage().error('Aborted')
    }
  }

  /* abort multipart upload */
  public async abortMultipartUpload() {
    const client = await this.getClient()

    try {
      const res = await client.abortMultipartUpload(
        AliOSSClient.checkPoint!.name,
        AliOSSClient.checkPoint!.uploadId,
      )
      AliOSSClient.checkPoint = null
      console.log(res)
    }
    catch (error) {
      console.log(error)
    }
  }
}
