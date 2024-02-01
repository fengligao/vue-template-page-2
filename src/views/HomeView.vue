<template>
  <div class="home">
    <template-page :tableConfig="{
      title: '表格标题'
    }" :form="form" requestMethod="Get" :requestConfig="{
      url: '/http/url'
    }" :beforeRequest="(param) => {
        return {
          ...param,
          otherKey: 'other key'
        }
      }" :afterResponse="(data) => {
        return {
          ...data,
          otherData: 'other data'
        }
      }" :paginationShow="true" :paginationFixed="false" :columns="[{
        type: '#',
        prop: '',
        label: '序号'
      }, {
        prop: 'name',
        label: '姓名'
      }, {
        prop: 'sex',
        label: '性别',
        slot: 'sex'
      }, {
        prop: 'date',
        label: '日期'
      }, {
        prop: 'address',
        label: '地址',
        showOverflowTooltip: true
      }, {
        prop: 'age',
        headerSlot: 'headerSlot',
        label: '年龄'
      }, {
        prop: 'status',
        type: 'map',
        label: '枚举的',
        map: {
          1: '成功',
          0: '失败'
        },
      }, {
        prop: 'age',
        type: 'options',
        label: '操作',
        width: 180,
        // 按钮的操作
        options: [
          {type: 'primary', text: '查看', clickEvent: (val) => this.view(val)},
          {type: 'warning', text: '编辑', clickEvent: (val) => this.edit(val)},
          {type: 'danger', text: '删除', clickEvent: (val) => this.del(val)},
          {type: 'info', text: '不能点的' },
          {type: 'info', text: '被禁用的', disabled: () => true },
        ]
      }]">
      <!-- 页面其他操作插槽 -->
      <template slot="contentOpts">
        <el-button type="primary" @click="add">新增</el-button>
        <el-button @click="outPut">导出</el-button>
      </template>
      <!-- 这是不使用默认表格 自定义内容的插槽 -->
      <!-- <template slot="contentSlots">
        <h1>自定义内容</h1>
      </template> -->
      <template slot="headerSlot">
        <span style="color: blue;">年龄-自定义</span>
      </template>
      <template slot="sex" slot-scope="scope">
        性别{{ scope.$index }}
      </template>
    </template-page>
  </div>
</template>

<script>
// @ is an alias to /src
import TemplatePage from "@/components/template-page/index.js";

export default {
  name: "HomeView",
  components: {
    TemplatePage,
  },
  data() {
    return {
      form: [{
        type: 'input',
        key: 'searchKey',
        label: '搜索',
        value: '',
        defaultValue: '哈哈',
        placeholder: '请输入搜索内容',
        disabled: false
      }, {
        type: 'select',
        key: 'selectKey',
        label: '单选',
        value: '',
        defaultValue: '',
        placeholder: '请选择',
        // 默认的options
        // options: [{
        //   value: '1',
        //   label: '黄金糕'
        // }, {
        //   value: '2',
        //   label: '双皮奶'
        // }],
        // 自定义label value
        props: {
          label: 'name',
          value: 'id'
        },
        // 异步获取 options 数据
        getOptions: () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve([{
                id: '3',
                name: '蚵仔煎'
              }, {
                id: '4',
                name: '龙须面'
              }, {
                id: '5',
                name: '北京烤鸭'
              }])
            }, 3000)
          })
        },
        disabled: false
      }, {
        type: 'checkbox',
        key: 'checkBoxKey',
        label: '多选',
        value: '',
        defaultValue: ['上海'],
        placeholder: '请选择',
        options: [{
          value: '1',
          label: '上海'
        }, {
          value: '2',
          label: '北京'
        }],
        disabled: false
      }, {
        type: 'radio',
        key: 'radioKey',
        label: '单选',
        value: '',
        defaultValue: '1',
        placeholder: '请选择',
        options: [{
          value: '1',
          label: '开始'
        }, {
          value: '2',
          label: '停止'
        }],
        disabled: false
      }, {
        type: 'date',
        key: 'dateKey',
        label: '日期',
        value: '',
        defaultValue: '',
        dateType: 'datetimerange',
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择日期',
        isPickerOptions: true,
        disabled: false
      }]
    }
  },
  methods: {
    edit(val) {
      this.$notify.info({
        title: '提示',
        message: '编辑操作：' + JSON.stringify(val)
      })
    },
    del(val) {
      this.$notify.info({
        title: '提示',
        message: '删除操作：' + JSON.stringify(val)
      })
    },
    view(val) {
      this.$notify.info({
        title: '提示',
        message: '查看操作：' + JSON.stringify(val)
      })
    },
    add() {
      this.$notify.info({
        title: '提示',
        message: '新增操作'
      })
    },
    outPut() {
      this.$notify.info({
        title: '提示',
        message: '导出操作'
      })
    }
  }
};
</script>

<style>
.home {
  padding: 20px;
  height: 100%;
}
</style>