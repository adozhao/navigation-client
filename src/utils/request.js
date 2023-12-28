import axios from 'axios'
import { Notification } from 'element-ui'
import router from '../router'
import store from '../store'
import constants from '@/constants'

const service = axios.create({
  baseURL: constants.baseUrl, 
  timeout: 5000
})

service.interceptors.request.use(config => {
  const token = store.state.user.token
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(response=>{
  const res = response.data;
  if (res.code !== 1) {
    if(res.code == 401){
      Notification({
        type: 'warning',
        title: '温馨提醒',
        position: 'bottom-right',
        message: '登录过期，请重新登陆'
      })
      store.commit('user/SET_TOKEN', '')
      router.push('/login')
    }
    else{
      Notification({
        type: 'warning',
        title: '温馨提醒',
        position: 'bottom-right',
        message: res.message
      })
    }
    return Promise.reject('error');
  } else {
    return response.data;
  }
},error=>{
    Notification({
      type: 'warning',
      title: '温馨提醒',
      position: 'bottom-right',
      message: error.message
    })
    return Promise.reject(error)
})

export default service