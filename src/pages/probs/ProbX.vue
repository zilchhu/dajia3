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
  name: 'ProbX',
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
          title: '品名',
          dataIndex: 'item_name',
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.item_name == value
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
        .single('x')
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
