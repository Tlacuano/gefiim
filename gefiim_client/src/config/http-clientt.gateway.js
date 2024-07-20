import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:3000/api-gefiim",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});


instance.interceptors.request.use(
    (config) => {
        const authData = JSON.parse(localStorage.getItem('auth'))

        if (authData) {
            config.headers['Authorization'] = `Bearer ${authData.payload.token}`
        }

        return config
    }
)


export default {
    async doGet(url){
        const response = await instance.get(url)
        return response.data
    },
    async doPost(url, data){
        const response = await instance.post(url, data)
        return response.data
    },
}

