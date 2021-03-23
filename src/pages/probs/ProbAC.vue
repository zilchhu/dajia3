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
</template>

<script>
import Probs from '../../api/probs'
import { message } from 'ant-design-vue'

export default {
  name: 'ProbAC',
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
          title: '门店id',
          dataIndex: 'shop_id',
          width: 90,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.shop_id == value
        },
        {
          title: '门店',
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
          title: '合作方案',
          dataIndex: '合作方案',
          slots: { filterDropdown: 'filterDropdown' },
          width: 150,
          onFilter: (value, record) => record.合作方案 == value
        },
        {
          title: '活动规则',
          dataIndex: '活动规则',
          width: 250,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.活动规则 == value
        },
        {
          title: '基础配送费',
          dataIndex: '基础配送费',
          align: 'right',
          width: 130,
          sorter: (a, b) => this.toNum(a.基础配送费) - this.toNum(b.基础配送费)
        },
        {
          title: '减配力度',
          dataIndex: '减配力度',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.减配力度) - this.toNum(b.减配力度)
        },
        {
          title: '力度偏差',
          dataIndex: '力度偏差',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.力度偏差) - this.toNum(b.力度偏差)
        },
        {
          title: '起送价',
          dataIndex: '起送价',
          align: 'right',
          width: 130,
          sorter: (a, b) => this.toNum(a.起送价) - this.toNum(b.起送价)
        },
        {
          title: '到期时间',
          dataIndex: '到期时间',
          width: 200,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.到期时间 == value
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
        .single('ac')
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
