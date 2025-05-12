const JCYL_BASE_URL =
  'https://analisis.datosabiertos.jcyl.es/api'

const JCYL_SEARCH_URL = `${JCYL_BASE_URL}/records/1.0/search/?dataset=informacion-polinica-historica&timezone=Europe%2FMadrid&lang=es`

type AllergyStatus = {
  allergen: string
  station: string
  status: string
  forecast: string
  date: string
}

export const getStatusByStation = async (
  station: string,
  allergen?: string
): Promise<AllergyStatus[]> => {
  const params = new URLSearchParams()
  params.set('order_by', 'fecha DESC')
  params.set('refine', `estaciones:"${station.toUpperCase()}"`)
  params.set('limit', '100')
  
  if (allergen) {
    params.set('where', `tipos_polinicos="${allergen}"`)
    params.set('limit', '1')
  }
  const url = `${JCYL_BASE_URL}/explore/v2.1/catalog/datasets/informacion-polinica-historica/records?${params.toString()}`
  
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch allergy status')
  }

  const data = await res.json()


  if (!data.results || data.results.length === 0) {
    return []
  }

  const firstResult = data.results[0]
  const results = allergen ? data.results : data.results.filter(res => res.fecha === firstResult.fecha)

  return results.map((r: any) => ({
    allergen: r.tipos_polinicos,
    station: r.estaciones,
    status: r.precedentes_ultimos_dias,
    forecast: r.prevision_proximos_dias,
    date: r.fecha
  }))
}

export const getStations = async (): Promise<{ name: string }[]> => {
  const url = `${JCYL_SEARCH_URL}&facet=estaciones`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch stations from JCYL API')
  }

  const body = await res.json()
  const facetGroup = body.facet_groups?.find((g: any) => g.name === 'estaciones')
  if (!facetGroup) {
    return []
  }
  return facetGroup.facets.map((f: any) => f.name ).sort()
}

export const getAllergens = async (): Promise<{ name: string }[]> => {
  const url = `${JCYL_SEARCH_URL}&facet=tipos_polinicos`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch allergens from JCYL API')
  }

  const body = await res.json()
  const facetGroup = body.facet_groups?.find((g: any) => g.name === 'tipos_polinicos')
  if (!facetGroup) {
    return []
  }
  return facetGroup.facets.map((f: any) => f.name ).sort()
}
