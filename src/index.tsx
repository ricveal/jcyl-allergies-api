import { Hono } from 'hono'
import { swaggerUI, SwaggerUI } from '@hono/swagger-ui'
import openapiSpec from './openapi'
import { getAllergens, getStations, getStatusByStation } from "./jcyl-api"
import { useCache } from "./cache"
import { getServers } from "./utils"

const app = new Hono<{ Bindings: CloudflareBindings }>()

// Global Middleware global for X-Source header
app.use('*', async (c, next) => {
  await next()
  c.header('X-Source', 'Fuente de los datos: Junta de Castilla y León')
})

// Endpoints
app.get('/stations', async (c) => {
  const stations = await useCache("stations", c.env, getStations)
  return c.json(stations.map(name => ({ name })))
})

app.get('/allergens', async (c) => {
  const allergens = await useCache("allergens", c.env, getAllergens)
  return c.json(allergens.map(name => ({ name })))
})

app.get('/allergy-status', async (c) => {
  let station = c.req.query('station')
  const allergen = c.req.query('allergen')

  if (!station) {
    return c.json({ error: 'Missing station' }, 400)
  }

  station = station.toUpperCase()
  const stations = (await getStations()).map(st => st.toUpperCase())

  if (!stations.includes(station)) {
    return c.json({ error: 'Invalid station' }, 400)
  }

  if (allergen) {
    const allergens = (await getAllergens())
    if (!allergens.includes(allergen)) {
      return c.json({ error: 'Invalid allergen' }, 400)
    }
  }

  const filteredAllergens = await getStatusByStation(station, allergen)

  return c.json(filteredAllergens)
})

app.get('/docs', (c) => {
  return c.html(`
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="${openapiSpec.info.description.split("<p>")[0]}" />
        <title>${openapiSpec.info.title}</title>
      </head>
      ${SwaggerUI({ url: '/doc', spec: {...openapiSpec, servers: getServers(c)} })}
    </html>
  `)
})

export default app
