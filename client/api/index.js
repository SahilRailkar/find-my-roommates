import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/'
})

export const createUser = data => api.post('/user', data)

const apis = {
    createUser
}

export default apis