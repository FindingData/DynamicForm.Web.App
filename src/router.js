import Vue from 'vue'
import Router from 'vue-router'
import Home from './layout/home.vue'
import FromList from './views/formList'
import DataSource from './views/dataSource'
import FormEdit from './views/formEdit'
import FormPreview from './views/formPreview'
import DataSourceEdit from './views/dataSourceEdit'
import DataSourceAdd from './views/dataSourceAdd'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path:'*',
      redirect:'/'
    },
    {
      path:'/',
      component:Home,
      children:[
        {
          path:'',
          component:FromList
        },
        {
          path:'/FormList',
          component:FromList
        },
        {
          path:'/FormEdit/:id',
          component:FormEdit
        },
        {
          path:'/FormPreview/:id',
          component:FormPreview
        },
        {
          path:'/DataSource',
          component:DataSource
        },
        {
          path:'/DataSourceEdit/:id',
          component:DataSourceEdit
        },
        {
          path:'/DataSourceAdd',
          component:DataSourceAdd
        }
      ]
    }
  ]
})
