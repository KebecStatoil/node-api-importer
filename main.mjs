import * as fs from 'fs'

import { getToken } from './token.mjs'

const {
    projectIds,
    baseUrl,
    path 
} = JSON.parse(fs.readFileSync('./private/config.json'))

const tokenDetails = await getToken()

const myHeaders = new Headers()
myHeaders.append("Accept", "application/json")
myHeaders.append("Accept-Encoding", "gzip, deflate")
myHeaders.append("Authorization", `Bearer ${tokenDetails.access_token}`)

const requestOptions = {
    method: "GET",
    headers: myHeaders
}

const getFilter = (projectId) => `$filter=IsPIMSRelevant eq true and ProjectExternalID eq '${projectId}' and GLAccount gt '3000000'`

const getPaging = (top, skip) => {
    if (!top) { return '' }
    if (!skip) { return `$top=${top}` }
    return `$top=${top}&$skip=${skip}`
}

const getUrl = (projectId, top, skip) => {
    let url = ''
    url += baseUrl
    url += path
    url += '?'
    url += getFilter(projectId)
    url += '&'
    url += getPaging(top, skip)
    return url
}

const pageSize = 500

for (const projectId of projectIds) {
    let responseCount = Infinity
    for (let skip = 0, top = pageSize; responseCount > 0; skip += top) {

        const url = getUrl(projectId, top, skip)

        console.log(url)

        const response = await fetch(url, requestOptions)
        const data = await response.json()

        responseCount = data.d.results.length

        console.log(responseCount)
        
        fs.writeFileSync(`./data/${projectId.replaceAll('.', '')}_data_segment_${top}_${skip}.json`, JSON.stringify(data, null, 4))

    }
}
