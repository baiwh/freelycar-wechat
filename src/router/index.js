import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: resolve =>require(['@/view/user/login.vue'],resolve),
      meta:{
        title:'登录'
      }
    },{
      path: '/order',
      name: 'order',
      component: resolve =>require(['@/view/technician/order.vue'],resolve),
    },{
      path: '/scanCode',
      name: 'scanCode',
      component: resolve =>require(['@/view/components/scanCode.vue'],resolve),
    },
    {
      path: '/chooseBrand',
      name: 'chooseBrand',
      component: resolve =>require(['@/view/components/chooseBrand.vue'],resolve),
    },{
      path: '/changeCar',
      name: 'changeCar',
      component: resolve =>require(['@/view/user/changeCar.vue'],resolve),
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: resolve =>require(['@/view/technician/orderDetail.vue'],resolve),
    },{
      path: '/locationInfo',
      name: 'locationInfo',
      component: resolve =>require(['@/view/technician/locationInfo.vue'],resolve),
    },{
      path: '/role-select/:arkSn',
      name: 'role-select',
      component:resolve =>require(['@/view/components/role-selection.vue'],resolve),
    },{
      path: '/changeUserInfo',
      name: 'changeUserInfo',
      component:resolve =>require(['@/view/user/changeUserInfo.vue'],resolve),
    },
    {
      path: '/tecLogin',
      name: 'tecLogin',
      component: resolve =>require(['@/view/technician/tecLogin.vue'],resolve),
    },{
      path: '/addCar',
      name: 'addCar',
      component: resolve =>require(['@/view/user/addCar.vue'],resolve),
    },{
      path: '/billingOrder',
      name: 'billingOrder',
      component: resolve =>require(['@/view/user/billingOrder.vue'],resolve),
    },{
      path: '/orderTracking',
      name: 'orderTracking',
      component: resolve =>require(['@/view/user/orderTracking.vue'],resolve),
    },{
      path: '/store',
      name: 'store',
      component: resolve =>require(['@/view/user/store.vue'],resolve),
    },
    {
      path: '/historyOrder',
      name: 'historyOrder',
      component: resolve =>require(['@/view/technician/historyOrder.vue'],resolve),
    },
    {
      path: '/payOrder',
      name: 'payOrder',
      component: resolve =>require(['@/view/user/payOrder.vue'],resolve),
    },
    {
      path: '/tecHome',
      name: 'tecHome',
      component: resolve =>require(['@/view/technician/tecHome.vue'],resolve),
    },
    {
      path: '/userHome',
      name: 'userHome',
      component: resolve =>require(['@/view/user/userHome.vue'],resolve),
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: resolve =>require(['@/view/user/userInfo.vue'],resolve),
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: resolve =>require(['@/view/user/myOrder.vue'],resolve),
    },
    {
      path: '/buyCard',
      name: 'buyCard',
      component: resolve =>require(['@/view/user/buyCard.vue'],resolve),
    },
    {
      path: '/chooseStore',
      name: 'chooseStore',
      component: resolve =>require(['@/view/user/chooseStore.vue'],resolve),
    },
    {
      path: '/openDoor',
      name: 'openDoor',
      component: resolve =>require(['@/view/components/openDoor.vue'],resolve),
    },
    {
      path: '/success',
      name: 'success',
      component: resolve =>require(['@/view/components/success.vue'],resolve),
    },
    {
      path: '/carInfo',
      name: 'carInfo',
      component: resolve =>require(['@/view/user/carInfo.vue'],resolve),
    },
    {
      path:'/service',
      name:'service',
      component: resolve => require(['@/view/user/service.vue'],resolve),
    }
  ],
  base:'/wechat/',
  mode: 'history',
})
