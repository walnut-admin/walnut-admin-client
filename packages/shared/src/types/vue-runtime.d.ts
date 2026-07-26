export {}

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends HTMLAttributes {
    vShow?: boolean
  }
}
