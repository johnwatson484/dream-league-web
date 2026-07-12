export function safePath (url: string | undefined, fallback: string): string {
  if (!url || typeof url !== 'string') {
    return fallback
  }

  if (!/^\/[^/\\]/.test(url)) {
    return fallback
  }

  if (/^\/\//.test(url) || /[:\\]/.test(url) || /[a-z][\da-z]*:/i.test(url)) {
    return fallback
  }

  return url
}
