const BLOCK_TYPES = new Set(['paragraph', 'heading', 'listItem', 'blockquote', 'codeBlock'])

export function extractPlainText(content: unknown): string {
  if (typeof content === 'string') return content
  if (!content || typeof content !== 'object') return ''

  const node = content as { type?: string; text?: string; content?: unknown[] }

  if (typeof node.text === 'string') return node.text

  const inner = Array.isArray(node.content) ? node.content.map(extractPlainText).join('') : ''

  return node.type && BLOCK_TYPES.has(node.type) ? `${inner}\n` : inner
}
