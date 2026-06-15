import type { PanelMode } from '../store/useAIPreferences'

// ── Storage ──
export const STORAGE_KEY_CONVERSATIONS = 'ai-conversations'
export const STORAGE_KEY_PREFERENCES = 'ai-preferences'

// ── Timing (ms) ──
export const SAVE_DEBOUNCE_MS = 1500
export const STREAMING_FLUSH_DEBOUNCE_MS = 50
export const SCROLL_SUPPRESS_MS = 150

// ── Scroll ──
export const SCROLL_NEAR_BOTTOM_PX = 50

// ── Cache limits ──
export const HEIGHTS_CACHE_MAX = 300
export const EXPAND_STATE_CACHE_MAX = 200
export const FORMAT_CACHE_MAX = 200

// ── Virtual list sizing ──
export const DEFAULT_VIRTUAL_ITEM_HEIGHT = 60
export const THINKING_ITEM_HEIGHT = 200
export const ITEM_HEIGHT_MAX_LINES = 50
export const ITEM_HEIGHT_BASE = 40
export const ITEM_HEIGHT_PER_LINE = 20
export const VIRTUAL_LIST_GAP = 12
export const VIRTUAL_LIST_OVERSCAN = 5

// ── AI provider ──
export const AI_PROVIDER: 'local' | 'deepseek' = 'deepseek'

// ── Z-index ──
export const DEFAULT_Z_INDEX = 2000
export const POPOVER_Z_INDEX_OFFSET = 1

// ── Conversation ──
export const TITLE_TRUNCATE_LENGTH = 30

// ── Default preferences ──
export const DEFAULT_DOCK_Y = 40
export const DEFAULT_PANEL_RIGHT = 48
export const DEFAULT_PANEL_BOTTOM = 20
export const DEFAULT_ASIDE_WIDTH = 420

// ── Panel modes ──
export const PANEL_MODES: PanelMode[] = ['panel', 'large-panel', 'content-aside']

// ── Floating dock ──
export const DOCK_CLAMP_MARGIN_PCT = 2
export const DOCK_TRIGGER_HEIGHT_PX = 32
export const DOCK_DRAG_CLICK_THRESHOLD_PCT = 0.5

// ── Animated placeholder ──
export const PLACEHOLDER_INTERVAL_MS = 3000

// ── Speech recognition ──
export const SPEECH_LANG = 'zh-CN'
export const SPEECH_MAX_ALTERNATIVES = 1

// ── JSON parser ──
export const JSON_BUFFER_MAX = 5000

export const NOTIFICATION_SOUND_URL = '/assets/ai_finish.mp3'
