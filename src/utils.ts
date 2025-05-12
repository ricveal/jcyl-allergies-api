import { env } from 'hono/adapter'

export const isDev = (c: any) => {
  const { DEV } = env<{ DEV: boolean }>(c)
  return DEV === "true"
}

const MAIN_SERVER = { url: ' https://jcyl-allergies-api.pages.dev/', description: 'Production'}

export const getServers = (c: any) => {
  const servers = isDev(c) ?  [
    {
      url: 'http://localhost:5173',
      description: 'Local Environment'
    },
    MAIN_SERVER
  ] : [MAIN_SERVER]
  return servers

}
