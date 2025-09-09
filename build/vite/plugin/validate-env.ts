import type { StandardSchemaV1 } from 'node_modules/zod/v4/core/standard-schema.cjs'
import { ValidateEnv } from '@julr/vite-plugin-validate-env'
import DevSchema from '../config/env.development'
import ProdSchema from '../config/env.prod'
import StagingSchema from '../config/env.staging'

type RecordViteKeys<T> = Record<`${string}_${string}`, T>

const envSchemaMap: Record<string, RecordViteKeys<StandardSchemaV1>> = {
  development: DevSchema,
  staging: StagingSchema,
  production: ProdSchema,
}

export function creatValidateEnvPlugin(mode: string) {
  return ValidateEnv({
    validator: 'standard',
    schema: envSchemaMap[mode],
  })
}
