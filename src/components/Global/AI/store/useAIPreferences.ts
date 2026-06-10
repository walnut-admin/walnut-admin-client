import { createGlobalState, useStorage } from '@vueuse/core'
import { DEFAULT_ASIDE_WIDTH, DEFAULT_DOCK_Y, DEFAULT_PANEL_BOTTOM, DEFAULT_PANEL_RIGHT, STORAGE_KEY_PREFERENCES } from '../config/constants'

export type PanelMode = 'panel' | 'large-panel' | 'content-aside'

export interface AIPreferences {
  dockY: number
  panelMode: PanelMode
  deepThinking: boolean
  panelRight: number
  panelBottom: number
  asideWidth: number
  asidePinned: boolean
}

const STORAGE_KEY = STORAGE_KEY_PREFERENCES

export const useAIPreferences = createGlobalState(() =>
  useStorage<AIPreferences>(STORAGE_KEY, {
    dockY: DEFAULT_DOCK_Y,
    panelMode: 'panel',
    deepThinking: false,
    panelRight: DEFAULT_PANEL_RIGHT,
    panelBottom: DEFAULT_PANEL_BOTTOM,
    asideWidth: DEFAULT_ASIDE_WIDTH,
    asidePinned: false,
  }),
)
