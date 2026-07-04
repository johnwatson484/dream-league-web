declare module 'blankie'
declare module '@hapi/cookie'
declare module 'xlsx'

declare module '@hapi/wreck' {
  const Wreck: {
    get(uri: string, options?: any): Promise<any>
    post(uri: string, options?: any): Promise<any>
    put(uri: string, options?: any): Promise<any>
    delete(uri: string, options?: any): Promise<any>
    [key: string]: any
  }
  export default Wreck
}

declare module 'hapi-pino' {
  const plugin: any
  export default plugin
}
