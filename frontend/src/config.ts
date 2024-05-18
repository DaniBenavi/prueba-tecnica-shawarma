declare global {
  interface ImportMetaEnv {
    VITE_API_HOST: string
  }
}

export const { VITE_API_HOST: Api_Host } = import.meta.env
