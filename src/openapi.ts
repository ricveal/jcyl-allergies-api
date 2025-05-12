const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API de Estado y Previsión de Alergias de Castilla y León',
    description:
      'API REST para consultar el estado actual y previsión de alérgenos en estaciones de medida dentro de Castilla y León.\n\nCreada a partir de los datos obtenidos de la plataforma de Datos Abiertos de la Junta de Castilla y León. <p>Fuente de los datos: <a href="http://datosabiertos.jcyl.es" title="Datos Abiertos de Castilla y León">Junta de Castilla y León</a>.</p>',
    version: '2.0.0'
  },
  paths: {
    '/stations': {
      get: {
        summary: 'Listado de estaciones',
        description: 'Devuelve todas las estaciones de medida disponibles.',
        tags: ["Maestros"],
        responses: {
          '200': {
            description: 'Lista de estaciones',
            headers: {
              'X-Source': {
                description: 'Fuente de los datos',
                schema: {
                  type: 'string',
                  example: 'Fuente de los datos: Junta de Castilla y León'
                }
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Station'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/allergens': {
      get: {
        summary: 'Listado de alérgenos',
        description: 'Devuelve todos los alérgenos disponibles.',
        tags: ["Maestros"],
        responses: {
          '200': {
            description: 'Lista de alérgenos',
            headers: {
              'X-Source': {
                description: 'Fuente de los datos',
                schema: {
                  type: 'string',
                  example: 'Fuente de los datos: Junta de Castilla y León'
                }
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Allergen'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/allergy-status': {
      get: {
        summary: 'Estado y previsión de alérgenos',
        description:
          'Obtiene el estado y la previsión de los alérgenos para una estación concreta, con posibilidad de filtrar por alérgeno.',
        tags: ["Estado y Previsión"],
        parameters: [
          {
            name: 'station',
            in: 'query',
            required: true,
            description: 'Nombre de la estación de medida',
            schema: {
              type: 'string',
              example: 'LEÓN'
            }
          },
          {
            name: 'allergen',
            in: 'query',
            required: false,
            description: 'Nombre del alérgeno a filtrar',
            schema: {
              type: 'string',
              example: 'Poaceae (GRAMINEAS)'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de estados y previsiones',
            headers: {
              'X-Source': {
                description: 'Fuente de los datos',
                schema: {
                  type: 'string',
                  example: 'Fuente de los datos: Junta de Castilla y León'
                }
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/AllergyStatus'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Station: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'LEÓN'
          }
        }
      },
      Allergen: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Poaceae (GRAMINEAS)'
          }
        }
      },
      AllergyStatus: {
        type: 'object',
        properties: {
          allergen: {
            type: 'string',
            example: 'Poaceae (GRAMINEAS)'
          },
          station: {
            type: 'string',
            example: 'LEÓN'
          },
          status: {
            type: 'string',
            example: 'BAJO'
          },
          forecast: {
            type: 'string',
            example: 'MODERADO'
          },
          date: {
            type: 'string',
            format: 'date',
            example: '2025-05-09'
          }
        }
      }
    }
  }
} as const

export default openapiSpec
