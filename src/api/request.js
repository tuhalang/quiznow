import axios from "axios"

const http = require("http")
const https = require("https")

export default function getInstanceAxios(baseAPI) {
    const instance = axios.create({
        baseURL: baseAPI,
        httpAgent: new http.Agent({keepAlive: true}),
        httpsAgent: new https.Agent({keepAlive: true}),
    })

    instance.interceptors.request.use(
        function (config) {
            config.headers = {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
            return config
        },
        function (error) {
            return Promise.reject(error)
        }
    )

    instance.interceptors.response.use(
        function (response) {
            try {
                if (response.status >= 200 && response.status < 300)
                    return response.data
                return Promise.reject(response.data)
            } catch (error) {
                return Promise.reject(error)
            }
        },
        async function (error) {
            return Promise.reject(error)
        }
    )

    return instance
}