import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import nix from 'highlight.js/lib/languages/nix'

hljs.registerLanguage('json', json)
hljs.registerLanguage('nix', nix)

export { hljs }
