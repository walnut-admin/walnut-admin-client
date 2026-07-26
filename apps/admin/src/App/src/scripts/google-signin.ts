import type { App } from 'vue'
import GoogleSignInPlugin from 'vue3-google-signin'

export function setupGoogleSignIn(app: App) {
  app.use(GoogleSignInPlugin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  })
}
