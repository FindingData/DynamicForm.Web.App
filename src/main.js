import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import {get,post} from '../src/utils/http'
Vue.prototype.$get=get
Vue.prototype.$post=post


Vue.config.productionTip = false
Vue.use(ElementUI)

router.beforeEach((to,from,next)=>{
  if(to.path.indexOf('/FormEdit')!==-1){
    store.commit('SET_LEFT_MEN_SLIDER',false)
  }else{
    store.commit('SET_LEFT_MEN_SLIDER',true)
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
