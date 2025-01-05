interface ImportMetaEnv {
    WAKU_PUBLIC_API_URL: string
    WAKU_PUBLIC_ANON_KEY: string
    WAKU_PUBLIC_PB_URL: string
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}