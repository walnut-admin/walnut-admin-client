<script lang="ts" setup>
import AppMonitorServerBattery from './src/battery.vue'
import AppMonitorServerCPU from './src/cpu.vue'
import AppMonitorServerDisk from './src/disk.vue'
import AppMonitorServerMem from './src/mem.vue'
import AppMonitorServerNetwork from './src/network.vue'
import AppMonitorServerOS from './src/os.vue'
import AppMonitorServerSystem from './src/system.vue'
import AppMonitorServerTime from './src/time.vue'

defineOptions({
  name: 'AppMonitorServer',
})
</script>

<template>
  <n-grid
    cols="1 s:1 m:1 l:2 xl:2 2xl:2"
    :x-gap="4"
    :y-gap="4"
    responsive="screen"
  >
    <n-grid-item>
      <n-grid cols="1" :x-gap="4" :y-gap="4" responsive="screen">
        <n-grid-item>
          <WTransition transition-name="fade-down" appear>
            <AppMonitorServerCPU />
          </WTransition>
        </n-grid-item>

        <n-grid-item>
          <WAppAuthorize
            value="app:monitor:server:memory"
            preset="tip"
            preset-width="100%"
            preset-height="230px"
          >
            <WTransition transition-name="fade-down" appear :duration="400">
              <AppMonitorServerMem />
            </WTransition>
          </WAppAuthorize>
        </n-grid-item>

        <n-grid-item>
          <WTransition transition-name="fade-down" appear :duration="500">
            <AppMonitorServerOS />
          </WTransition>
        </n-grid-item>

        <n-grid-item>
          <WAppAuthorize
            value="app:monitor:server:system"
            preset="tip"
            preset-width="100%"
            preset-height="230px"
          >
            <WTransition transition-name="fade-down" appear :duration="600">
              <AppMonitorServerSystem />
            </WTransition>
          </WAppAuthorize>
        </n-grid-item>
      </n-grid>
    </n-grid-item>

    <n-grid-item>
      <n-grid cols="1" :x-gap="4" :y-gap="4" responsive="screen">
        <n-grid-item>
          <WTransition transition-name="fade-down" appear :duration="700">
            <AppMonitorServerDisk />
          </WTransition>
        </n-grid-item>

        <n-grid-item>
          <WTransition transition-name="fade-down" appear :duration="800">
            <AppMonitorServerBattery />
          </WTransition>
        </n-grid-item>

        <n-grid-item>
          <WTransition transition-name="fade-down" appear :duration="900">
            <AppMonitorServerTime />
          </WTransition>
        </n-grid-item>

        <n-grid-item>
          <WAppAuthorize
            value="app:monitor:server:network"
            preset="tip"
            preset-width="100%"
            preset-height="230px"
          >
            <WTransition transition-name="fade-down" appear :duration="1000">
              <AppMonitorServerNetwork />
            </WTransition>
          </WAppAuthorize>
        </n-grid-item>
      </n-grid>
    </n-grid-item>
  </n-grid>
</template>
