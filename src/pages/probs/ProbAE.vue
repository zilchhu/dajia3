<template lang="pug">
a-table(:columns="columns" :data-source="table" rowKey="key" :loading="loading" 
  :pagination="{showSizeChanger: true, defaultPageSize: 100, pageSizeOptions: ['50', '100', '200', '400'], size: 'small'}" 
  size="small" :scroll="{y: scrollY}")

  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    a-row(type="flex")
      a-col(flex="auto")
        a-select(mode="multiple" :value="selectedKeys" @change="setSelectedKeys" :placeholder="`filter ${column.title}`" :style="`min-width: 160px; width: ${column.width || 220}px;`")
          a-select-option(v-for="option in getColFilters(column.dataIndex)" :key="option.value") {{option.value}} 
      a-col(flex="60px")
        a-button(type="link" @click="confirm") confirm
        br
        a-button(type="link" @click="clearFilters") reset

  template(#rule="{text, record}")
    span.pre {{text}}
</template>

<script>
import Probs from '../../api/probs'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

export default {
  name: 'ProbAE',
  data() {
    return {
      table: [],
      loading: false,
      scrollY: 900
    }
  },
  computed: {
    columns() {
       return [
        {
          title: '店铺编号',
          dataIndex: '店铺编号',
          width: 110,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.店铺编号 == value
        },
        {
          title: '店铺名称',
          dataIndex: '店铺名称',
          width: 250,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.店铺名称 == value
        },
        {
          title: '平台',
          dataIndex: '平台',
          width: 70,
          filters: [
            { text: '美团', value: '美团' },
            { text: '饿了么', value: '饿了么' }
          ],
          filterMultiple: true,
          onFilter: (value, record) => record.平台 == value
        },
        {
          title: '责任人',
          dataIndex: '责任人',
          width: 100,
          slots: { filterDropdown: 'filterDropdown', customRender: 'person' },
          onFilter: (value, record) => record.责任人 == value
        },
        {
          title: '活动类型',
          dataIndex: '活动类型',
          width: 130,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.活动类型 == value
        },
        {
          title: '活动规则',
          dataIndex: '活动规则',
          slots: { filterDropdown: 'filterDropdown', customRender: 'rule' },
          onFilter: (value, record) => record.活动规则 == value
        },
        {
          title: '结束时间',
          dataIndex: '结束时间',
          width: 200,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.结束时间 == value,
          sorter: (a, b) => dayjs(a.结束时间).isBefore(dayjs(b.结束时间)) ? -1 : 1
        }
      ]
    }
  },
  methods: {
    getColFilters(colName) {
      return Array.from(new Set(this.table.map(row => row[colName]))).map(col => ({
        text: col,
        value: col
      }))
    },
    toNum(str) {
      try {
        return parseFloat(str)
      } catch (error) {
        return 0
      }
    },
    fetchTable() {
      this.loading = true
      new Probs()
        .single('ae')
        .then(res => {
          this.table = res
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    }
  },
  created() {
    this.scrollY = document.body.clientHeight - 176
    this.fetchTable()
  }
}
</script>

<style lang="sass" scoped>
.pre 
  white-space: pre-wrap
</style>