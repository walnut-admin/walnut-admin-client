export function useAppEnvCrypto() {
  return {
    url: import.meta.env.VITE_CRYPTO_URL,
  }
}

export function useAppEnvTitle() {
  return {
    title: import.meta.env.VITE_APP_TITLE,
  }
}

export function useAppEnvProxy() {
  const proxy = import.meta.env.VITE_PROXY

  const api = proxy[0]
  const ws = proxy[1]

  return {
    api,
    ws,
    httpUrl: +api[0] === 1 ? api[1] : api[2],
    baseURLForSocket: +ws[0] === 1 ? ws[1] : ws[2],
  }
}

export function useAppEnvBuild() {
  return {
    publicPath: import.meta.env.VITE_PUBLIC_PATH,
  }
}

export function useAppEnvSeconds() {
  return {
    axiosTimeout: import.meta.env.VITE_SECONDS_AXIOS_TIMEOUT,
    axiosCache: import.meta.env.VITE_SECONDS_AXIOS_CACHE,
    persist: import.meta.env.VITE_SECONDS_PERSIST,
  }
}
