export function safePath (url: string | undefined, fallback: string): string {
  if (!url || typeof url !== 'string') {
    return fallback
  }

  if (!/^\/[^/\\]/.test(url)) {
    return fallback
  }

  if (url.startsWith('//') || url.includes(':') || url.includes('\\')) {
    return fallback
  }

  return url
}
