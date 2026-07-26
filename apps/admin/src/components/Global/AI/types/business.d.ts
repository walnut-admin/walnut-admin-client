// ============================================
// Card（UI 渲染型）荷载映射
// 添加新 Card 类型：在此 interface 加一行即可
// ============================================
interface CardPayloadMap {
  /** 示例占位，迁移完成后替换为实际业务类型 */
  'example-card': { title: string, description: string }
}

// ============================================
// Action（逻辑执行型）荷载映射
// 添加新 Action 类型：在此 interface 加一行即可
// ============================================
interface ActionPayloadMap {
  /** 示例占位 */
  'example-action': { message: string }
}

// ============================================
// 工具类型：Map → discriminated union
// ============================================
type UnionFromMap<M> = {
  [K in keyof M & string]: { type: K } & M[K]
}[keyof M & string]

type BusinessCardTypes = UnionFromMap<CardPayloadMap> & { category: 'card' }
type BusinessActionTypes = UnionFromMap<ActionPayloadMap> & { category: 'action' }

declare type IAIBusinessContent = BusinessCardTypes | BusinessActionTypes

// 泛型提取工具类型
declare type CardPayload<K extends keyof CardPayloadMap> = CardPayloadMap[K]
declare type ActionPayload<K extends keyof ActionPayloadMap> = ActionPayloadMap[K]
