# 🚨 JCyL Allergies API 🤧

Proof of concept using [Cloudflare Workers](https://developers.cloudflare.com/workers/) to publish an easy API to view Allergies information provided by the [Open Data published by Junta de Castilla y León](https://analisis.datosabiertos.jcyl.es/pages/polen/).

Fuente de los datos: [Junta de Castilla y León](http://datosabiertos.jcyl.es/).

## Development

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/languages/typescript/#generate-types):

```txt
npm run generate-types
```
