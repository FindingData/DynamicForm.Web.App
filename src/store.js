import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import page from './store/module/page'

export default new Vuex.Store({
 modules:{
     page
 }
})
