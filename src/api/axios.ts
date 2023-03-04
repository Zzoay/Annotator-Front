import axios, { AxiosResponse } from 'axios';
import {ElMessage} from "element-plus";
// import { showMessage } from "./status";   // 引入状态码文件
import { getCookie } from "../utils";
import router from "../router"


// 设置接口超时时间
axios.defaults.timeout = 60000;

// @ts-ignore
axios.defaults.baseURL = import.meta.env.VITE_API_DOMAIN;   

// http request 拦截器
axios.interceptors.request.use(
  config => {
  // 配置请求头
    config.headers = {
      'X-CSRFToken': getCookie('csrftoken')
    };
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data
    // console.log('response => ', response)
    if (data.status === '401') {
        localStorage.removeItem('user');
        ElMessage({
            message: data.error,
            type: 'error',
            duration: 1.5 * 1000
        })
        return router.push('/login')
    } else if (data.status === 'error') {
        ElMessage({
            message: data.error || data.status,
            type: 'error',
            duration: 1.5 * 1000
        })
    }

    if (data.success === false && data.msg) {
        ElMessage({
            message: data.msg,
            type: 'error',
            duration: 1.5 * 1000
        })
    }
    return data
},
({message, response}) => {
    // console.log('err => ', message, response) // for debug
    if (response && response.data && response.data.detail) {
        ElMessage({
            message: response.data.detail,
            type: 'error',
            duration: 2 * 1000
        })
    } else {
        ElMessage({
            message: message,
            type: 'error',
            duration: 2 * 1000
        })
    }
    if (response && (response.status === 403 || response.status === 401)) {
        localStorage.removeItem('user')
        router.push('/login')
        // return router.push('/login')
    }
    return Promise.reject(message)
})

// 封装 GET POST 请求并导出
export function request(url='', params={}, type='POST'){
//设置 url params type 的默认值
return new Promise((resolve,reject)=>{
  let promise
  if( type.toUpperCase()==='GET' ){
    promise = axios({
      url,
      params
    })
  }else if( type.toUpperCase()=== 'POST' ){
    promise = axios({
      method:'POST',
      url,
      data:params
    })
  }else if( type.toUpperCase()=== 'DELETE' ){
    promise = axios({
      method:'DELETE',
      url,
      data:params
    })
  }else if( type.toUpperCase()=== 'PUT' ){
    promise = axios({
      method:'PUT',
      url,
      data:params
    })
  }
  else if( type.toUpperCase()=== 'PATCH' ){
    promise = axios({
      method:'PATCH',
      url,
      data:params
    })
  }
  //处理返回
  promise.then(res=>{
    resolve(res)
  }).catch(err=>{
    reject(err)
  })
})
}