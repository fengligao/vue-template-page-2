import './index.less'
const tableListJson = [{
  date: '2016-05-02',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1518 弄',
  age: 18,
  status: 0
}, {
  date: '2016-05-04',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1517 弄',
  age: 19,
  status: 1
}, {
  date: '2016-05-01',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1519 弄',
  age: 20,
  status: 1
}, {
  date: '2016-05-03',
  name: '王小虎',
  address: '上海市普陀区金沙江路 1516 弄',
  age: 21,
  status: 0
}]
const pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }]
}

export default {
  props: {
    // 筛选标准字段有以下几个：
    // form[<Object>]
    // type 控件类型 // input, select, date, radio, checkbox
    // key 请求参数key
    // label 控件名称
    // value 控件值
    // defaultValue: 默认值
    // placeholder 控件提示
    // disabled 是否禁用
    // options 数据项
    // getOptions 异步获取数据项
    // props 自定义数据项key
    // 时间日期控件会多以下几个字段
    // dateType 时期控件类型 datetime/datetimerange/daterange
    // format 日期显示格式
    // valueFormat 选中值格式
    // isPickerOptions 是否带快捷选项
    form: {
      type: Array,
      default: () => []
    },
    // 表格配置
    tableConfig: {
      type: Object,
      default: () => {
        return {
          title: '',
          rowKey: 'id'
        }
      }
    },
    // 请求配置
    requestConfig: {
      type: Object,
      required: true
    },
    // 请求方法
    requestMethod: {
      type: String,
      default: () => 'Get'
    },
    // 请求前 参数处理的回调
    beforeRequest: {
      type: Function,
      default: () => null
    },
    // 请求后 数据处理的回调
    afterResponse: {
      type: Function,
      default: () => null
    },
    // 加载提示配置
    loadingConfig: {
      type: Object,
      default: () => {
        return {
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)'
        }
      }
    },
    // 表格列配置
    // 单元格的配置列字段包含以下几种：
    // column[Object]
    // label 单元格名称
    // prop 单元格数据展示key
    // type 单元格类型 text map option
    // slot 如果是插槽 单元格插槽名称
    // map 单元格 枚举对象
    // fixed 单元格是否固定
    // showOverflowTooltip 单元格内容是否超出省略 鼠标悬浮提示
    // options 操作类型的 按钮组字段
    columns: {
      type: Array,
      default: () => []
    },
    // 是否显示分页
    paginationShow: {
      type: Boolean,
      default: () => true
    },
    // 分页是否置底
    paginationFixed: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    // 初始化表单筛选项
    const formList = this.initForm(this.form)
    return {
      formList,
      tableData: [], // 表格数据
      loading: false,
      pagination: {
        pageNo: 1, // 当前页
        pageSize: 20, // 页码大小
        total: 0, // 总条数
        pageSizes: [10, 20, 50, 100] //每页显示条数
      }
    }
  },
  mounted() {
    console.log(this.formList);
    this.onSearch()
  },
  methods: {
    // 初始化表单数据
    initForm(form) {
      const formItems = []
      for (let i = 0; i < form.length; i++) {
        const formItem = form[i]
        switch (formItem.type) {
          case 'input':
            formItem.value = formItem.defaultValue || ''
            break;
          case 'select':
            formItem.value = formItem.defaultValue || ''
            formItem.options = formItem.options || [];

            if (typeof formItem.getOptions === 'function') {
              formItem.getOptions().then(res => {
                formItem.options = res
              })
            }
            break;
          case 'checkbox':
            formItem.value = formItem.defaultValue || []
            if (!formItem.options) {
              formItem.options = []
            }
            if (typeof formItem.getOptions === 'function') {
              formItem.getOptions().then((options) => {
                formItem.options = options;
              });
            }
            break;
          case 'radio':
            formItem.value = formItem.defaultValue || ''
            if (typeof formItem.getOptions === 'function') {
              formItem.getOptions().then((options) => {
                formItem.options = options;
              });
            }
            break;
          case 'date':
            formItem.value = formItem.defaultValue || ''
            if (formItem.isPickerOptions) {
              formItem.pickerOptions = pickerOptions
            }
            break;
          default:
            break;
        }
        formItems.push(formItem)
      }
      return formItems
    },
    // 分页操作
    handleCurrentChange(pageIndex) {
      this.pagination.pageNo = pageIndex;
      this.onSearch();
    },
    handleSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.onSearch();
    },
    //数据请求触发方法
    onSearch() {
      const page = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize
      };
      let form = {}
      this.formList.forEach(v => {
        form[v.key] = v.value
      })

      if (this.paginationShow) {
        Object.assign(form, page);
      }

      console.log(form);
      let newForm = this.beforeRequest(form)
      console.log('请求接口入参：', newForm);
      // 数据请求的操作
      if (this.requestMethod === 'Get') {
        this.loading = true
        let params = { ...newForm }
        console.log(params);
        setTimeout(() => {
          let data = {
            code: 1,
            data: tableListJson,
            msg: '请求成功'
          }
          let newData = this.afterResponse ? this.afterResponse(data) : data
          console.log('请求返回值：', newData);
          // requestConfig.url 请求的地址 等其他操作可自行扩展
          this.tableData = newData.data
          this.pagination.total = 30
          this.loading = false
        }, 2000)
      } else if (this.requestMethod === 'Post') {
        // post请求同理的操作
        // return ...
      } else {
        this.$notify.warning({
          title: '提示',
          message: '仅支持Get或Post请求'
        })
      }
    },
    // 筛选操作函数
    onChangeFormItem(value, item, i) {
      console.log(value, item, i);
      this.formList[i].value = value
    },
    // 筛选input渲染
    renderInput(item, index) {
      return <el-form-item class="page-form__item" label={item.label}>
        <el-input
          class="page-form__item--input"
          type="text"
          value={item.value}
          placeholder={item.placeholder}
          onInput={(value) => this.onChangeFormItem(value, item, index)}
          disabled={item.disabled}>
        </el-input>
      </el-form-item>
    },
    // 筛选select渲染
    renderSelect(item, index) {
      return <el-form-item class="page-form__item" label={item.label}>
        <el-select
          value={item.value}
          placeholder={item.placeholder}
          onChange={(value) => this.onChangeFormItem(value, item, index)}
          disabled={item.disabled}>
          {
            item.options.map((v, i) => {
              return <el-option
                key={i}
                label={item.props && item.props.label ? v[item.props.label] : v.label}
                value={item.props && item.props.value ? v[item.props.value] : v.value}>
              </el-option>
            })
          }
        </el-select>
      </el-form-item>
    },
    // 筛选checkBox
    renderCheckBox(item, index) {
      return (
        <el-form-item class="page-form__item" label={item.label}>
          <el-checkbox-group
            value={item.value}
            onInput={(value) => this.onChangeFormItem(value, item, index)}
            disabled={item.disabled}>
            {
              item.options.map(v => {
                return <el-checkbox label={item.props && item.props.label ? v[item.props.label] : v.label} key={item.props && item.props.value ? v[item.props.value] : v.value}></el-checkbox>
              })
            }
          </el-checkbox-group>
        </el-form-item>
      )
    },
    // 筛选radio
    renderRadio(item, index) {
      return (
        <el-form-item class="page-form__item" label={item.label}>
          <el-radio-group
            value={item.value}
            onInput={(value) => this.onChangeFormItem(value, item, index)}
            disabled={item.disabled}>
            {
              item.options.map(v => {
                return <el-radio label={item.props && item.props.value ? v[item.props.value] : v.value}>{item.props && item.props.label ? v[item.props.label] : v.label}</el-radio>
              })
            }
          </el-radio-group>
        </el-form-item>
      )
    },
    // 筛选datePicker
    renderDatePicker(item, index) {
      return (
        <el-form-item class="page-form__item" label={item.label}>
          <el-date-picker
            value={item.value}
            type={item.dateType || 'date'}
            placeholder={item.placeholder}
            format={item.format || 'yyyy-MM-dd'}
            value-format={item.valueFormat || 'yyyy-MM-dd'}
            pickerOptions={item.dateType === 'datetimerange' && item.pickerOptions}
            onInput={(date) => this.onChangeFormItem(date, item, index)}
            disabled={item.disabled}>
          </el-date-picker>
        </el-form-item>
      )
    },
    // 表单渲染
    renderForm() {
      if (this.formList.length === 0 && !this.$scopedSlots.form) {
        return null
      }
      if (this.$scopedSlots.form && this.$scopedSlots.form()) {
        return <div>{this.$scopedSlots.form()}</div>
      }
      let formItems = []
      for (let i = 0; i < this.formList.length; i++) {
        const formItem = this.formList[i]
        switch (formItem.type) {
          case 'input':
            console.log(this.renderInput(formItem, i));
            formItems.push(this.renderInput(formItem, i))
            break;
          case 'select':
            formItems.push(this.renderSelect(formItem, i))
            break;
          case 'checkbox':
            formItems.push(this.renderCheckBox(formItem, i))
            break;
          case 'radio':
            formItems.push(this.renderRadio(formItem, i))
            break;
          case 'date':
            formItems.push(this.renderDatePicker(formItem, i))
            break;
          default:
            break;
        }
      }
      return <el-Form class="page-form">
        {formItems}
        <el-form-item class="margin-left-100px">
          <el-button type="primary" onClick={this.onSearch}>查 询</el-button>
          <el-button>重 置</el-button>
        </el-form-item>
      </el-Form>
    },
    // 表格单元格渲染
    renderTableColumn() {
      return this.columns.map(col => {
        const { fixed = null, showOverflowTooltip } = col

        const length = col.options && col.options.length || null

        const headerSlot = this.genHeaderSlot(col); // 自定义表头
        const defaultSlot = this.genDefaultSlot(col); // 自定义表格单元格
        const tableCellSlot = {
          scopedSlots: {
            ...headerSlot,
            ...defaultSlot,
          }
        }
        // 表格序号渲染
        if (col.type === '#') {
          return <el-table-column
            type="text"
            label={col.label}
            className={col.className}
            width={col.width || 60}
            fixed={fixed}
            formatter={(row, column, cellValue, index) => {
              return index + 1;
            }}
            {...tableCellSlot}>
          </el-table-column>
        }
        switch (col.type) {
          case 'options':
            return <el-table-column
              prop={col.prop}
              label={col.label}
              className={col.className}
              width={col.width}
              show-overflow-tooltip={showOverflowTooltip}
              fixed={fixed}
              formatter={(row) => {
                let btns, moreBtn
                if (length > 3) {
                  btns = col.options.slice(0, 2)
                  moreBtn = col.options.slice(2, length)
                } else {
                  btns = col.options
                }
                return length > 3 ? this.renderOptionsAndMore(btns, moreBtn, row) : this.renderOptions(btns, row)
              }}
            >
            </el-table-column>
          case 'map': // 枚举单元格
            return <el-table-column
              prop={col.prop}
              label={col.label}
              className={col.className}
              width={col.width}
              show-overflow-tooltip={showOverflowTooltip}
              fixed={fixed}
              formatter={(row) => {
                return col.map[row[col.prop]];
              }}
              {...tableCellSlot}
            >
            </el-table-column>
          default:
            return <el-table-column
              type="text"
              prop={col.prop}
              label={col.label}
              className={col.className}
              width={col.width}
              show-overflow-tooltip={showOverflowTooltip}
              fixed={fixed}
              {...tableCellSlot}>
            </el-table-column>
        }
      })
    },
    // 根据自定义表头的配置，动态生成需要的scopedSlot对象
    genHeaderSlot(col) {
      if (Object.prototype.hasOwnProperty.call(col, 'headerSlot')) {
        return {
          header: () => {
            return this.$scopedSlots.headerSlot();
          }
        };
      }
      return {};
    },
    // 自定义表格单元格的slot显示
    genDefaultSlot(col) {
      if (Object.prototype.hasOwnProperty.call(col, 'slot')) {
        return {
          // scope 是当前渲染单元格的数据
          default: scope => {
            return this.$scopedSlots[col.slot](scope);
          }
        }
      }
    },
    // 按钮时间函数
    buttonEvents(v, row) {
      if (v.clickEvent) {
        v.clickEvent(row)
      } else {
        this.$notify.warning({ title: '提示', message: '请传入clickEvent事件参数' })
      }
    },
    // 渲染按钮
    renderButton(v, row, type) {
      let color = 'page-template--button__' + v.type
      let className = type === 'more' ? 'page-template--button ' + color : color
      // 按钮的渲染操作 涵盖了样式类型自定义点击后的操作，包含按钮是否被禁用的回调等等
      return <el-button type="text" disabled={v.disabled && v.disabled(row)} class={className} onClick={() => this.buttonEvents(v, row)} style={{ color: v.color, display: v.isHide && v.isHide(row) ? 'none' : 'inline-block' }}>{v.text}</el-button>
    },
    // 表格操作渲染
    renderOptions(btns, row) {
      return btns && btns.map(v => {
        return this.renderButton(v, row)
      })
    },
    // 渲染更多按钮
    renderOptionsAndMore(btns, moreBtn, row) {
      return (<div>
        {this.renderOptions(btns, row)}
        {
          <el-dropdown>
            <el-button style={{ marginLeft: '10px' }} type="text">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              {moreBtn.map(v => {
                return <el-dropdown-item>
                  {this.renderButton(v, row, 'more')}
                </el-dropdown-item>
              })}
            </el-dropdown-menu>
          </el-dropdown>
        }
      </div>)
    },
    // 表格标题渲染 
    renderTableHead() {
      return this.tableConfig && this.tableConfig.title ? <h5>{this.tableConfig.title || ''}</h5> : null
    },
    // 表格内容区域渲染
    renderContainer() {
      const { contentSlots } = this.$scopedSlots;
      // 如果有自定义插槽默认展示自定义的内容
      return contentSlots ? <div>{contentSlots()}</div> : (
        <div>
          {this.renderTableHead()}
          <el-table
            data={this.tableData}
            style="width: 100%">
            {this.renderTableColumn()}
          </el-table>
        </div>
      )
    },
    // 分页渲染
    renderPagination() {
      return this.paginationShow ? (
        <div class={'page-pagination ' + (this.paginationFixed ? 'fixed' : '')}>
          <el-pagination
            on-size-change={this.handleSizeChange}
            on-current-change={this.handleCurrentChange}
            current-page={this.pagination.pageNo}
            page-size={this.pagination.pageSize}
            page-sizes={this.pagination.pageSizes}
            layout="total, prev, pager, next, sizes, jumper"
            total={this.pagination.total}
          >
          </el-pagination>
        </div>
      ) : null
    },
    // 页面操作区域渲染
    renderContentOpts() {
      const { contentOpts } = this.$scopedSlots;

      return (
        contentOpts ? <div class="page-option">
          {contentOpts()}
        </div> : null
      )
    },
    // 页面整体渲染
    renderPage() {
      return (
        <div>
          {this.renderForm()}
          {this.renderContentOpts()}
          <div
            class="page-container"
            v-loading={this.loading}
            element-loading-text={this.loadingConfig.text}
            element-loading-spinner={this.loadingConfig.spinner}
            element-loading-background={this.loadingConfig.background}>
            {this.renderContainer()}
          </div>
          {this.renderPagination()}
        </div>
      )
    }
  },
  render() {
    return (
      <div class="page">
        {this.renderPage()}
      </div>
    )
  }
}