const rtf = new Intl.RelativeTimeFormat('hu', { numeric: 'auto' })

export function formatRelativeTime(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)
  const months = Math.round(days / 30)
  const years = Math.round(days / 365)

  if (seconds < 60) return rtf.format(-seconds, 'second')
  if (minutes < 60) return rtf.format(-minutes, 'minute')
  if (hours < 24) return rtf.format(-hours, 'hour')
  if (days < 30) return rtf.format(-days, 'day')
  if (months < 12) return rtf.format(-months, 'month')
  return rtf.format(-years, 'year')
}
