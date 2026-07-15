import axios from 'axios';
import 'server-only'

let resolveBaseUrl: string | undefined

const REQUEST_TIMEOUT  = 30000;

export const apiClient = axios.create({
    timeout: REQUEST_TIMEOUT,
    headers:{
        'Content-Type': 'application/json',
    }
})

function getBaseUrl() {
    if(resolveBaseUrl) return resolveBaseUrl

    const envURL = process.env.LOCAL_ENDPOINT
    
    if(!envURL) {
        throw new Error("Endpoint is not defined")
    }

    resolveBaseUrl = envURL

    return envURL
}

apiClient.interceptors.request.use((config) => {
    config.baseURL = getBaseUrl()
    return config
})