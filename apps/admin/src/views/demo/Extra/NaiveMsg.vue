<script lang="ts" setup>
defineOptions({
  name: 'NaiveMsgDemo',
  defaultView: false,
})

const appStoreNaive = useAppStoreNaive()

const notiPool: Record<number, Fn> = {
  1: () => useAppNotiSuccess('Notification Success'),
  2: () => useAppNotiInfo('Notification Info', { closable: false }),
  3: () => useAppNotiWarning('Notification Warning', { duration: 1000 }),
  4: () => useAppNotiError('Notification Error', { placement: 'top-left' }),
  5: () => useAppNotiError('Got a 64px margin top', { containerStyle: { marginTop: '64px' } }),
  6: () => appStoreNaive.destroyCurrentNotiInst(),
  7: () => appStoreNaive.destroyAllNotiInst(),
}

function onOpenNoti(type: number) {
  notiPool[type]()
}

const msgPool: Record<number, Fn> = {
  1: () => useAppMsgSuccess(),
  2: () => useAppMsgInfo('Message Info', { closable: false }),
  3: () => useAppMsgWarning('Message Warning', { duration: 1000 }),
  4: () => useAppMsgError('Message Error', { placement: 'top-left' }),
}

function onOpenMsg(type: number) {
  msgPool[type]()
}

async function onOpenComfirm() {
  const { confirmed } = await useAppConfirm('Do you want to continue?')

  if (confirmed)
    useAppMsgSuccess()
  else
    useAppMsgInfo('Canceled')
}
</script>

<template>
  <WDemoCard title="Naive UI message/notification/confirm usage">
    <n-list>
      <n-list-item>
        <WTitle
          class="mb-2"
          prefix="bar"
          help-message="`placement` works for all current notification instances, so be careful when use `placement` prop."
        >
          Notification
        </WTitle>

        <n-space size="small">
          <n-button @click="onOpenNoti(1)">
            Success (default is 5s)
          </n-button>
          <n-button @click="onOpenNoti(2)">
            Info (not closable)
          </n-button>
          <n-button @click="onOpenNoti(3)">
            Warning (1s)
          </n-button>
          <n-button @click="onOpenNoti(4)">
            Error (position: top-right)
          </n-button>
          <n-button @click="onOpenNoti(5)">
            Error (containerStyle: margin)
          </n-button>
          <n-button @click="onOpenNoti(6)">
            Close current noti
          </n-button>
          <n-button @click="onOpenNoti(7)">
            Close all noti
          </n-button>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle
          class="mb-2"
          prefix="bar"
          help-message="`placement` works for all current message instances, so be careful when use `placement` prop."
        >
          Message
        </WTitle>

        <n-space size="small">
          <n-button @click="onOpenMsg(1)">
            Success (default is 3s)
          </n-button>
          <n-button @click="onOpenMsg(2)">
            Info (not closable)
          </n-button>
          <n-button @click="onOpenMsg(3)">
            Warning (1s)
          </n-button>
          <n-button @click="onOpenMsg(4)">
            Error (position: top-right)
          </n-button>
        </n-space>
      </n-list-item>

      <n-list-item>
        <WTitle class="mb-2" prefix="bar">
          Confirm
        </WTitle>

        <n-space size="small">
          <n-button @click="onOpenComfirm">
            Need confirm to continue
          </n-button>
        </n-space>
      </n-list-item>
    </n-list>
  </WDemoCard>
</template>
