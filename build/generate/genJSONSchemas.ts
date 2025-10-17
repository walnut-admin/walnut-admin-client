import * as TJS from 'ts-json-schema-generator'

import { BuildUtilsWriteFile } from '../utils'
import {
  AppSettingsDevInterfaceFilePath,
  AppSettingsDevJSONSchemaFilePath,
} from '../utils/paths'

const config: import('ts-json-schema-generator/dist/src/Config').Config = {
  path: AppSettingsDevInterfaceFilePath,
  tsconfig: 'tsconfig.json',
  type: 'IStoreSetting.Dev', // Or <type-name> if you want to generate schema for that one type only
}

const shapeSchema = TJS.createGenerator(config).createSchema(config.type)
  ;(async () => {
  const newData = JSON.stringify(shapeSchema, null, 2)

  await BuildUtilsWriteFile(AppSettingsDevJSONSchemaFilePath, newData)
})()
