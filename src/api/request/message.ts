import baseURL from './base-url';
import axios from '../http';

if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = baseURL.dev
} else {
    axios.defaults.baseURL = baseURL.prod
}

export function getMessageList () {
  return axios.get(`/v1/getPosts`)
}
