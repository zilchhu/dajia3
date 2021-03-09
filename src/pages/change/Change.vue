<template lang="pug">
a-table.ant-table-change(:columns="changes_cols" :data-source="changes" rowKey="key" :loading="loading" 
  :pagination="{showSizeChanger: true, defaultPageSize, pageSizeOptions: ['50', '100', '200', '400'], size: 'small'}" 
  @change="table_change" :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)"
  size="small" :scroll="{y: scrollY}" bordered)

  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    a-row(type="flex")
      a-col(flex="auto")
        a-select(mode="multiple" :value="selectedKeys" @change="setSelectedKeys" :placeholder="`filter ${column.title}`" :style="`min-width: 160px; width: ${column.width || 220}px;`")
          a-select-option(v-for="option in getColFilters(column.dataIndex)" :key="option.value") {{option.value}} 
      a-col(flex="60px")
        a-button(type="link" @click="confirm") confirm
        br
        a-button(type="link" @click="clearFilters") reset

  template(#shop_id="{text, record}")
    router-link.small(:to="{name: 'shop', params: {shopid: text}}") {{text}}

  template(#person="{text, record}")
    router-link.small(:to="{ name: 'user', params: { username: text || '-', date: 0 }}") {{text}}

  template(#rule="{text, record}")
    a-tooltip
      template(#title)
        div(v-for="item in text")
          .rule {{item.rule}}
          .rule {{item.date}}
          .mini {{item.insert_date}}
      .rule {{text.map(v=>v.rule).join('\n')}}

  template(#handle="{text, record}")
    a-input(:value="text" @change="e => handleChange(e.target.value, record)" size="small")
      template(#suffix)
        loading-outlined(v-show="record.saving")
</template>

<script>
import Change from '../../api/change'
import { message } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

export default {
  name: 'change',
  components: {
    LoadingOutlined
  },
  data() {
    return {
      loading: false,
      changes: [],
      changes_cols: [
        {
          title: '门店id',
          dataIndex: 'shop_id',
          width: 90,
          slots: { filterDropdown: 'filterDropdown', customRender: 'shop_id' },
          onFilter: (value, record) => record.shop_id == value
        },
        {
          title: '店名',
          dataIndex: 'shop_name',
          width: 250,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.shop_name == value
        },
        {
          title: '平台',
          dataIndex: 'platform',
          width: 70,
          filters: [
            { text: '美团', value: '美团' },
            { text: '饿了么', value: '饿了么' }
          ],
          filterMultiple: true,
          slots: { customRender: 'small' },
          onFilter: (value, record) => record.platform == value
        },
        {
          title: '负责',
          dataIndex: 'person',
          width: 70,
          slots: { filterDropdown: 'filterDropdown', customRender: 'person' },
          onFilter: (value, record) => record.person == value
        },
        {
          title: '活动',
          dataIndex: 'title',
          width: 110,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.title == value
        },
        {
          title: '变化前',
          dataIndex: 'before_rule',
          slots: { customRender: 'rule' }
        },
        {
          title: '变化后',
          dataIndex: 'after_rule',
          slots: { customRender: 'rule' }
        },
        {
          title: '处理',
          dataIndex: 'handle',
          filters: [
            { text: '已处理', value: '.+' },
            { text: '未处理', value: '^$' }
          ],
          filterMultiple: true,
          slots: { customRender: 'handle' },
          onFilter: (value, record) => new RegExp(value).test(record.handle)
        },
        {
          title: '变化日期',
          dataIndex: 'change_date',
          width: 100,
          slots: { filterDropdown: 'filterDropdown' },
          defaultFilteredValue: [dayjs().format('YYYYMMDD')],
          onFilter: (value, record) => record.change_date == value
        }
      ],
      scrollY: 900,
      debounce_save: null,
      defaultPageSize: 100
    }
  },
  methods: {
    getColFilters(colName) {
      return Array.from(new Set(this.changes.map(row => row[colName]))).map(col => ({
        text: col,
        value: col
      }))
    },
    debounce(fn) {
      let timeout = null
      return function() {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn.apply(this, arguments), 800)
      }
    },
    fetch_changes() {
      this.loading = true
      new Change()
        .single()
        .then(res => {
          this.changes = res
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    },
    handleChange(value, record) {
      const target = this.changes.filter(item => record.key === item.key)[0]
      if (target) {
        target['handle'] = value
        this.debounce_save(record)
      }
    },
    save(record) {
      const target = this.changes.filter(item => record.key === item.key)[0]
      if (target) {
        target['saving'] = true
        new Change()
          .save(record.key, target['handle'])
          .then(res => {
            console.log(res)
            target['saving'] = false
          })
          .catch(err => {
            message.error(err)
            target['saving'] = true
          })
        // console.log(this.changes)
      }
    },
    table_change(pagination) {
      localStorage.setItem('changes/defaultPageSize', pagination.pageSize)
    }
  },
  created() {
    this.scrollY = document.body.clientHeight - 126
    this.defaultPageSize = +localStorage.getItem('changes/defaultPageSize') || 100
    this.debounce_save = this.debounce(this.save)
    this.fetch_changes()
  },
  watch: {
    $route(route) {
      if (route.name == 'changes') {
        this.defaultPageSize = +localStorage.getItem('changes/defaultPageSize') || 100
      }
    }
  }
}
</script>

<style lang="sass">
.rule
  white-space: pre-wrap

.mini
  font-size: 11px
  color: gray

.ant-table-change .ant-table-thead > tr > th
  background: white
  border-bottom: 1px solid rgba(180,247,255,.2)

.ant-table-change span.ant-table-column-title, .ant-table-change td, .ant-table-change .ant-input, .ant-table-change .ant-table-thead > tr > th, .small
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
  font-size: 0.886em
  color: #2c363c

.ant-table-change .table-striped
  background-color: #fafafa

</style>
