interface TrieNode {
  readonly children: Record<string, TrieNode | undefined>
  isWord: boolean
}

function createNode(): TrieNode {
  return { children: Object.create(null) as Record<string, TrieNode | undefined>, isWord: false }
}

export class Trie {
  private readonly root: TrieNode

  constructor() {
    this.root = createNode()
  }

  insert(word: string): void {
    let current = this.root
    for (const char of word.toLowerCase()) {
      let child = current.children[char]
      if (!child) {
        child = createNode()
        current.children[char] = child
      }
      current = child
    }
    current.isWord = true
  }

  hasWord(word: string): boolean {
    const node = this.traverse(word.toLowerCase())
    return node !== null && node.isWord
  }

  hasPrefix(prefix: string): boolean {
    return this.traverse(prefix.toLowerCase()) !== null
  }

  private traverse(str: string): TrieNode | null {
    let current = this.root
    for (const char of str) {
      const child = current.children[char]
      if (!child) {
        return null
      }
      current = child
    }
    return current
  }
}

export function buildTrie(words: ReadonlySet<string>): Trie {
  const trie = new Trie()
  for (const word of words) {
    trie.insert(word)
  }
  return trie
}
