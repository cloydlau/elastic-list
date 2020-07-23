import Vue from 'vue'
import App from './index.vue'

Vue.config.productionTip = false

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

/**
 * 全局参数会被组件props中的同名参数（如果有）的值覆盖
 */
import ElasticList from '../src/main.ts' //dev
//import ElasticList from '../dist/elastic-list.umd' //prod
//import ElasticList from 'elastic-list' //todo
/*Vue.use(ElasticList, {
  sortable: true,
  editable: false,
  count: [1, 4],
  rowTemplate: {name: 'name'},
  elTableProps: {
    border: false,
    fit: false,
    stripe: false,
    highlightCurrentRow: false,
  }
})*/

new Vue({
  render: h => h(App),
}).$mount('#app')
