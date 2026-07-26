<script lang="ts" setup>
import type { IWCompVendorLocationPickerProps } from '.'

defineOptions({ name: 'WVendorLocationPicker' })

const props = withDefaults(defineProps<IWCompVendorLocationPickerProps>(), {
  height: '50vh',
  width: '80vw',
})

const modelValue = defineModel<string>('value', { required: true })
const addressValue = defineModel<string>('address')

const appStoreKey = useAppStoreKey()
const appStoreGeoIP = useAppStoreGeoIP()

const wrapRef = shallowRef<HTMLDivElement>()

const mapInst = shallowRef()
const localSearchInst = shallowRef()
const geoCoderInst = shallowRef()

const modalVisible = ref(false)
const searchOptions = ref<{ label: string, value: string }[]>([])

async function initMap(lng: number, lat: number) {
  if (mapInst.value)
    return

  const BMapGL = window.BMapGL

  const map = new BMapGL.Map(wrapRef.value, { enableSdkStorage: false })
  mapInst.value = map

  const defaultPt = new BMapGL.Point(lng, lat)
  map.centerAndZoom(defaultPt, 15)
  map.enableScrollWheelZoom(true)
  map.addControl(new BMapGL.ScaleControl())
  map.addControl(new BMapGL.MapTypeControl())

  const cityControl = new BMapGL.CityListControl({
    anchor: window.BMAP_ANCHOR_TOP_LEFT,
    offset: new BMapGL.Size(10, 5),
  })
  map.addControl(cityControl)

  createSearch(BMapGL)

  createMapClick(BMapGL)
}

function loadBMapGL(ak: string) {
  return new Promise((resolve, reject) => {
    if (window.BMapGL?.Map)
      return resolve(window.BMapGL)

    window.__onBMapLoaded = () => {
      delete window.__onBMapLoaded
      resolve(window.BMapGL)
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://api.map.baidu.com/api?type=webgl&v=1.0&ak=${ak}&callback=__onBMapLoaded`
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function doZoomAfterChoose(point: { lng: number, lat: number }) {
  mapInst.value.centerAndZoom(point, 18)
}

function createMapClick(BMapGL: any) {
  geoCoderInst.value = new BMapGL.Geocoder()

  function onMapClick(e: { type: string, latlng: { lng: number, lat: number } }) {
    const pt = e.latlng

    mapInst.value.clearOverlays()
    mapInst.value.addOverlay(new BMapGL.Marker(pt))

    geoCoderInst.value.getLocation(pt, (rs: any) => {
      localSearchInst.value?.search(rs.address)

      doZoomAfterChoose(pt)
    })
  }

  useEventListener(mapInst, 'click', onMapClick)

  return geoCoderInst.value
}

function createSearch(BMapGL: any) {
  localSearchInst.value = new BMapGL.LocalSearch(mapInst.value!, {
    renderOptions: { map: mapInst.value!, autoViewport: false, panel: null },
    onSearchComplete: (results: any) => {
      searchOptions.value = results.getPoi(0)
        ? Array.from({ length: results.getNumPois() })
          .map((_, i) => {
            const poi = results.getPoi(i)
            return poi
              ? { label: `${poi.title} · ${poi.address}`, value: [poi.point.lng, poi.point.lat].join(',') }
              : null
          })
          .filter(Boolean) as { label: string, value: string }[]
        : []
    },
  })
}

function onSelect(lngLat: string) {
  if (!lngLat)
    return

  const pt = new window.BMapGL.Point(...lngLat.split(','))
  mapInst.value.clearOverlays()
  mapInst.value.addOverlay(new window.BMapGL.Marker(pt))
  mapInst.value.panTo(pt)

  modelValue.value = lngLat
  addressValue.value = searchOptions.value.find(i => i.value === lngLat)?.label

  doZoomAfterChoose(pt)
}

function onClear() {
  modelValue.value = ''
  addressValue.value = ''
  searchOptions.value = []
}

async function onOpen() {
  modalVisible.value = true

  await appStoreKey.initBaiduKey()
  await loadBMapGL(appStoreKey.getBaiduAK!)
  await initMap(appStoreGeoIP.getLng, appStoreGeoIP.getLat)

  // 3. 回显已有坐标
  if (props.value?.length === 2) {
    const pt = new window.BMapGL.Point(props.value[0], props.value[1])
    geoCoderInst.value.getLocation(pt, () => {
      mapInst.value.centerAndZoom(pt, 18)
      mapInst.value.addOverlay(new window.BMapGL.Marker(pt))
    })
  }
}

const onSearch = useDebounceFn((value: string) => {
  if (!value.trim()) {
    searchOptions.value = []
    return
  }
  localSearchInst.value.search(value)
}, 400)

tryOnScopeDispose(() => {
  mapInst.value.clearOverlays()
})
</script>

<template>
  <div>
    <n-input readonly :value="addressValue" @click="onOpen" />

    <WModal v-model:show="modalVisible" :title="$t('comp.location.title')" width="80%" height="80%" display-directive="show">
      <WSelect
        v-model:value="modelValue"
        :options="searchOptions"
        filterable
        remote
        clearable
        placeholder="输入地址搜索"
        class="mb-2 w-full"
        @search="onSearch"
        @update:value="onSelect"
        @clear="onClear"
      />

      <div ref="wrapRef" :style="{ height: props.height, width: props.width }" />
    </WModal>
  </div>
</template>

<style scoped>

</style>
