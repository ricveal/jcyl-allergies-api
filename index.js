import { Router } from 'itty-router'

const URL =
  'https://analisis.datosabiertos.jcyl.es/api/v2/catalog/datasets/informacion-polinica-actual'

const router = Router()

const init = {
  headers: {
    'content-type': 'application/json;charset=UTF-8',
  },
}

router
  .get('/', async req => {
    const response = await getStations()
    return new Response(response, init)
  })
  .get('/:id', async req => {
    const response = await getAlergies(req.params.id)
    return new Response(response, init)
  })
  .get('*', () => new Response('Not found', { status: 404 }))

async function getStations() {
  const response = await fetch(`${URL}/facets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await response.json()
  const { facets } = data
  const stations = facets.find(facet => facet.name === 'estaciones').facets
  return JSON.stringify(stations.map(station => station.name))
}

async function getAlergies(station) {
  const response = await fetch(
    `${URL}/records?where=estaciones="${station}"&limit=100&offset=0&timezone=UTC`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  const data = await response.json()
  const { records } = data
  const alergies = records.map(rec => {
    const { fields } = rec.record
    return {
      name: fields.tipos_polinicos,
      date: fields.fecha,
      status: fields.precedentes_ltimos_dias,
      forecast: fields.previsi_n_proximos_dias,
    }
  })
  return JSON.stringify(alergies)
}

addEventListener('fetch', event =>
  event.respondWith(router.handle(event.request)),
)
