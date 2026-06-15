import type { CompletionContext } from '@codemirror/autocomplete'
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript'

function myCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/)!

  if (word.from === word.to && !context.explicit)
    return null
  return {
    from: word.from,
    options: [
      { label: 'match', type: 'keyword' },
      { label: 'hello', type: 'variable', info: '(World)' },
    ],
  }
}

export const languages = [
  javascript(),
  javascriptLanguage.data.of({ autocomplete: myCompletions }),
]
