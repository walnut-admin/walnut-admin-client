class AsyncLocalStorage implements IStorageAsync {
  public length = localStorage.length

  async getItem(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key))
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
    return Promise.resolve()
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key)
    return Promise.resolve()
  }

  async clear(): Promise<void> {
    localStorage.clear()
    return Promise.resolve()
  }

  key(index: number): string | null {
    return localStorage.key(index)
  }
}

export const syncLocalStorage = localStorage

export const asyncLocalStorage = new AsyncLocalStorage()
