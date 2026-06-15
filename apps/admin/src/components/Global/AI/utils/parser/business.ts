// src/components/Global/AI/utils/parser/business.ts

export function parseBusinessContent(parsed: Record<string, any> | null): IAIBusinessContent | null {
  if (!parsed || typeof parsed.type !== 'string')
    return null

  const { type, ...rest } = parsed

  // Card types
  const cardTypes: (keyof CardPayloadMap)[] = ['example-card']
  if ((cardTypes as string[]).includes(type)) {
    return { type, category: 'card', ...rest } as unknown as IAIBusinessContent
  }

  // Action types
  const actionTypes: (keyof ActionPayloadMap)[] = ['example-action']
  if ((actionTypes as string[]).includes(type)) {
    return { type, category: 'action', ...rest } as unknown as IAIBusinessContent
  }

  return null
}

export function getBusinessSummary(bc: IAIBusinessContent): string {
  switch (bc.type) {
    case 'example-card':
      return `[Card: ${(bc as any).title || bc.type}]`
    case 'example-action':
      return `[Action: ${(bc as any).message || bc.type}]`
    default: {
      const _exhaustive: never = bc
      return `[${(_exhaustive as any).type}]`
    }
  }
}
