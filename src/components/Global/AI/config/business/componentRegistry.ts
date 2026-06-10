import type { Component } from 'vue'
import BusinessPlaceholder from '../../components/business/BusinessPlaceholder.vue'

export const CARD_COMPONENT_MAP: {
  [K in keyof CardPayloadMap]: Component
} = {
  'example-card': BusinessPlaceholder,
}
