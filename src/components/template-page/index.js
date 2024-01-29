import './index.less'


export default {
  props: {
    form: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      html: 'template page'
    }
  },
  mounted() {
    console.log(this.$scopedSlots);
  },
  methods: {
    onChangeFormItem(value, item, i) {
      this.form[i].value = value
    },
    initInput(item, i) {
      return <el-form-item class="page-form__item" label={item.label}>
        <el-input
          class="page-form__item--input"
          type="text"
          v-model={item.value}
          placeholder={item.placeholder}
          onInput={(value) => this.onChangeFormItem(value, item, i)}>
        </el-input>
      </el-form-item>
    },
    initForm() {
      if (this.form.length === 0 && !this.$scopedSlots.form) {
        return null
      }
      if (this.$scopedSlots.form && this.$scopedSlots.form()) {
        return <div class="page-form">
          {this.$scopedSlots.form()}
        </div>
      }
      const formItems = []
      for (let i = 0; i < this.form.length; i++) {
        const formItem = this.form[i]

        switch (formItem.type) {
          case 'input':
            formItems.push(this.initInput(formItem, i))
            break;
          default:
            break;
        }
      }
      return <div class="page-form">
        <el-Form>
          {formItems}
          <el-form-item>
            <el-button type="primary" onClick={this.onSearch}>查 询</el-button>
            <el-button>重 置</el-button>
          </el-form-item>
        </el-Form>
      </div>
    },
    onSearch() {
      let form = {}
      this.form.forEach(v => {
        form[v.key] = v.value
      })
      console.log(form);
    }
  },
  render() {
    return (
      <div class="page">
        {this.initForm()}
        <div class="page-option">
          操作区域
        </div>
        <div class="page-container">
          内容区域
        </div>
      </div>
    )
  }
}