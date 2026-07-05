export function isInRole (credentials: { scope?: string[] } | null | undefined, role: string): boolean {
  if (!credentials?.scope) {
    return false
  }
  return credentials.scope.includes(role)
}
