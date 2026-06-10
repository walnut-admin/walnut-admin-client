export const ACTION_HANDLER_MAP: {
  [K in keyof ActionPayloadMap]: (payload: ActionPayloadMap[K]) => void | Promise<void>
} = {
  'example-action': (p) => {
    window.$message?.info(p.message)
  },
}
