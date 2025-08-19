type AsyncTask<T> = () => Promise<T>

export class SingletonPromise<T> {
  private promise: Promise<T> | null = null

  run(task: AsyncTask<T>): Promise<T> {
    if (!this.promise) {
      this.promise = task()
        .catch((e) => {
          this.promise = null
          throw e
        })
        .finally(() => {
          this.promise = null
        })
    }
    return this.promise
  }
}
