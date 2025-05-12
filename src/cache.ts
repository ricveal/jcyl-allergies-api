const TTL_SECONDS = 60 * 60 * 24 // 1 day

type Env = { CACHE_KV: KVNamespace }

export const useCache = async (
  facetName: string,
  env: Env,
  fetchFn: () => Promise<{ name: string }[]>
): Promise<{ name: string }[]> => {
  const cacheKey = `facet:${facetName}`
  const cached = await env.CACHE_KV.get(cacheKey, 'json')
  if (cached) return cached

  const result = await fetchFn()

  await env.CACHE_KV.put(cacheKey, JSON.stringify(result), {
    expirationTtl: TTL_SECONDS
  })

  return result
}

