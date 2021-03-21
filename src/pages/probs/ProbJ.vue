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
  name: 'ProbJ',
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
          onFilter: (value, record) => record.platform == value
        },
        {
          title: 'person',
          dataIndex: 'person',
          width: 90,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.person == value
        },
        {
          title: '分类',
          dataIndex: '分类',
          width: 140,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.分类 == value
        },
        {
          title: '品名',
          dataIndex: '品名',
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.品名 == value
        },
        {
          title: '原价',
          dataIndex: '原价',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.原价) - this.toNum(b.原价)
        },
        {
          title: '餐盒费',
          dataIndex: '餐盒费',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.餐盒费) - this.toNum(b.餐盒费)
        },
        {
          title: '起购数',
          dataIndex: '起购数',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.起购数) - this.toNum(b.起购数)
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
        .single('j')
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
