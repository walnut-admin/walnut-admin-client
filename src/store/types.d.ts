export namespace IStoreComp {
  export interface CapJS {
    inst: ICapInst | null
    show: boolean
    onSuccess: ((token: string) => void) | null
  }

  export interface ForceQuit {
    show: Ref<boolean | null>
    quitButton: boolean
  }

  export interface ReloadPrompt {
    needRefresh: boolean
    offlineReady: boolean
    reloadFn: () => void
  }
}
