type AsyncTask<T> = () => Promise<T>

export class SingletonPromise<T> {
  private promise: Promise<T> | null = null
  private clearOnFinally: boolean = true

  constructor(clearOnFinally: boolean = true) {
    this.clearOnFinally = clearOnFinally
  }

  run(task: AsyncTask<T>): Promise<T> {
    if (!this.promise) {
      this.promise = task()
        .catch((e) => {
          this.promise = null
          throw e
        })
        .finally(() => {
          if (this.clearOnFinally)
            this.promise = null
        })
    }
    return this.promise
  }
}
