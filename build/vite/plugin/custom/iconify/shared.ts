import { BuildUtilsLog } from '../../../../utils'

/**
 * Log icon-related information
 * @param {string} title - Log title
 * @param {string} data - Log content
 */
export function IconLog(title: string, data: string) {
  BuildUtilsLog(
    `
// ==============================================
// ${title}
// ==============================================
// ${data}
// ==============================================
`,
  )
}

// ant-design -> antdesign
export function cleanName(n: string) {
  return n.replace(/-/g, '')
}

/**
 * Build a trie data structure from icon array
 * @param {string[]} iconArr - Array of icon strings
 * @returns {Map<string, any>} Trie structure
 */
export function buildTrie(iconArr: string[]) {
  const trie = new Map<string, any>()
  for (const icon of iconArr) {
    let node = trie
    for (const ch of icon) {
      if (!node.has(ch))
        node.set(ch, new Map())
      node = node.get(ch)
    }
    node.set('_end', icon) // Record complete icon string
  }
  return trie
}

/**
 * Scan content to find used icons using trie
 * @param {string} content - Content to scan
 * @param {Map<string, any>} trie - Trie structure for icon matching
 * @returns {Set<string>} Set of found icons
 */
export function scanIcons(content: string, trie: Map<string, any>) {
  const found = new Set<string>()
  const n = content.length
  for (let i = 0; i < n;) {
    let node = trie
    let j = i
    while (j < n && node.has(content[j])) {
      node = node.get(content[j++])
      if (node.has('_end'))
        found.add(node.get('_end')) // Found complete icon
    }
    // Skip non-word characters to prevent intermediate matching
    while (j < n && /[\w:]/.test(content[j])) j++
    i = j + 1
  }
  return found
}
