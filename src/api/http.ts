// 此文件用于封装axios
import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
// 先导入vuex, 因为我们要使用到里面的状态对象
import { store } from '@/store'
import router from '@/router'
import { message } from 'ant-design-vue'
import { ACCESS_TOKEN } from '@/common/ts/constants'

// 创建axios实例
var instance = Axios.create({
  // 跨域请求时是否允许带cookie，慎用，注册时会报错
  // withCredentials: true,
  timeout: 10000
})

// post请求头的设置
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

// 添加拦截器
instance.interceptors.request.use((config: AxiosRequestConfig) => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    const value = localStorage.getItem(ACCESS_TOKEN)
    const token = JSON.parse(value!)
    if (token && config.headers) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  }, (error: any) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use((response: AxiosResponse) => {
  if (response.status === 200) return Promise.resolve(response)
  else Promise.reject(response)
  }, (error: any) => {
    if (error.response.status) {
      switch (error.response.status) {
        // 未授权
        case 401:
          router.replace({
            path: '/login'
          })
          break
        // 未找到内容
        case 404:
          message.info('网络请求不存在')
          router.replace({
            path: '/not-found'
          })
          break
        default:
          message.error(error.response.data.message)
      }
      return Promise.reject(error.response)
    }
  }
)

export default instance
