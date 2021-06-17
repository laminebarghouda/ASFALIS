const elasticsearch = require('elasticsearch')

// Core ES variables for this project
const index = 'authority'
const type = 'amm'
const port = 9200
const host = process.env.ES_HOST || 'localhost'
const client = new elasticsearch.Client({ host: { host, port } })

/** Check the ES connection status */
async function checkConnection () {
  let isConnected = false
  while (!isConnected) {
    console.log('Connecting to ES')
    try {
      const health = await client.cluster.health({})
      console.log(health)
      isConnected = true
    } catch (err) {
      console.log('Connection Failed, Retrying...', err)
    }
  }
}

/** Clear the index, recreate it, and add mappings */
async function resetIndex () {
  if (await client.indices.exists({ index })) {
    await client.indices.delete({ index })
  }

  await client.indices.create({ index })
  await putAMMMapping()
}

/** Add book section schema mapping to ES */
async function putAMMMapping () {
  const schema = {
    specialite : { type: 'keyword' },
    dosage : { type: 'text' },
    forme : { type: 'text' },
    presentation : { type: 'text' },
    conditionnement_primaire : { type: 'text' },
    specification : { type: 'text' },
    dci : { type: 'keyword' },
    classement_VEIC : { type: 'text' },
    classe_therapeutique : { type: 'text' },
    sous_classe : { type: 'text' },
    laboratoire : { type: 'text' },
    tableau : { type: 'text' },
    duree_conservation : { type: 'text' },
    indication : { type: 'text' },
    generique_princeps : { type: 'text' },
    amm : { type: 'text' },
    date_amm : { type: 'text' },
  }

  return client.indices.putMapping({ index, type, body: { properties: schema } })
}

module.exports = {
  client, index, type, checkConnection, resetIndex
}
