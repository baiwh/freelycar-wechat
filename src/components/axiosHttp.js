import axios from 'axios'
import router from '../router'


//设置默认请求头
//部署上线
// axios.defaults.baseURL ='https://www.freelycar.com/api'
// 本地调试
// axios.defaults.baseURL ='/api'
axios.defaults.timeout = 60000
axios.defaults.headers = {
  'Content-Type': 'application/json'
}
//请求数据拦截
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('Authorization')) {
      config.headers.Authorization = localStorage.getItem('Authorization');
    }
    console.log(config)
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//响应拦截器异常处理
axios.interceptors.response.use(response => {
  // console.log(response.data.message)
  // console.log(localStorage.getItem('wxinfo'))
  if(response.data.message=="JWT Expired"){
    // localStorage.removeItem('jwt')
    // if(localStorage.getItem('clientId')){
    //   // console.log(router.currentRoute.fullPath)
    //   // localStorage.removeItem('wxinfo');
    //   localStorage.removeItem('jwt')
    localStorage.clear();
      this.$router.push({
        path: '/login',
        // query: {
        //   redirect: router.currentRoute.fullPath
        // }
      })

    // }
    // if(localStorage.getItem('staffId')){
    //   // localStorage.removeItem('staffinfo');
    //   localStorage.removeItem('jwt')
    //   router.replace({
    //     path: '/tecLogin',
    //     query: {
    //       redirect: router.currentRoute.fullPath
    //     }
    //   })
    // }
  }
  return response
}, error => {
  return Promise.resolve(error.response)
})

// var api = '/test';
var api = '/api';

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(api + url, {
      params: params
    })
      .then(response => {
        // console.log(response)
        if (response.data.code === 1) {
          resolve(response.data.data)
        } else {
          if (response.data.msg) {
            reject(response.data.msg)
            // alert('msg:'+response.data.msg)
          }
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(api + url, data)
      .then(response => {
        if (response.data.code === 1 || response.data.status === 0) {
          if (response.data.result) {
            resolve(response.data.result)
          } else {
            resolve(response.data.data)
          }
        } else {
          //报错
          if (response.data.msg) {
            reject(response.data.msg)
            // alert('msg:'+response.data.msg)
          }
        }
      }, err => {
        // alert('err:'+err)
        reject(err)
      })
  })
}
