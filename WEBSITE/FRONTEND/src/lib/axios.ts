import axios from 'axios'

const axiosClient = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:3000/`, //`${window.location.protocol}//${window.location.hostname}/` - for live
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

export default axiosClient
