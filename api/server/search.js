const { client, index, type } = require('./connection')

module.exports = {
  /** Query ES index for the provided term */
  queryTerm (term, offset = 0) {

    const body = {

      query: { 
          "bool": {
            "should": [ 
                { 
                  "match": 
                    { 
                      "dci^3": {
                        "query": term,
                        "fuzziness": 'auto'
                      } 
                    }
                },
                { 
                  "match": 
                    { 
                      "specialite": {
                        "query": term,
                        "fuzziness": 'auto'
                      } 
                    }
                },
                { 
                  "match": 
                    { 
                      "indication": {
                        "query": term,
                        "operator": 'and',
                        "fuzziness": 'auto'
                      } 
                    }
                },
            ]
          },
      },
      highlight: { fields: { text: {} } }
    }

    return client.search({ index, type, body })
    
  },
}
