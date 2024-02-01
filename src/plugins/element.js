import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Table,
  TableColumn,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  DatePicker,
  Loading,
  Notification,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Pagination
} from 'element-ui'

Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(DatePicker)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Pagination)

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
