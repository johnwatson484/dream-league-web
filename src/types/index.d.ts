import type { SessionData } from '../session/session-manager.ts'
import type { ResponseObject } from '@hapi/hapi'

declare module '@hapi/hapi' {
  interface ResponseToolkit {
    view(template: string, context?: Record<string, unknown>): ResponseObject
  }

  interface RequestApplicationState {
    session: SessionData | null
  }
}
