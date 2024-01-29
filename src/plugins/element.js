import Vue from 'vue'
import { Button, Form, FormItem, Input } from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
