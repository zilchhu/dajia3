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
  name: 'ProbL',
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
          title: '订单数',
          dataIndex: '订单数',
          width: 140,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.订单数 == value
        },
        {
          title: '实收',
          dataIndex: '实收',
          width: 100,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.实收 == value
        },
        {
          title: '联盟津贴',
          dataIndex: '联盟津贴',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.联盟津贴) - this.toNum(b.联盟津贴)
        },
        {
          title: '减配送费',
          dataIndex: '减配送费',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.减配送费) - this.toNum(b.减配送费)
        },
        {
          title: '商家代金券',
          dataIndex: '商家代金券',
          align: 'right',
          width: 120,
          sorter: (a, b) => this.toNum(a.商家代金券) - this.toNum(b.商家代金券)
        },
        {
          title: '超值联盟',
          dataIndex: '超值联盟',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.超值联盟) - this.toNum(b.超值联盟)
        },
        {
          title: '新客立减',
          dataIndex: '新客立减',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.新客立减) - this.toNum(b.新客立减)
        },
        {
          title: '会员红包',
          dataIndex: '会员红包',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.会员红包) - this.toNum(b.会员红包)
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
        .single('l')
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
