<template lang="pug">
a-table(:columns="columns" :data-source="table" rowKey="key" :loading="loading" 
  :pagination="{showSizeChanger: true, defaultPageSize: 100, pageSizeOptions: ['50', '100', '200', '400'], size: 'small'}" 
  size="small" :scroll="{y: scrollY}")

  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    table-select(:style="`min-width: 160px; width: ${column.width + 50 || 250}px;`" :filterOptions="getColFilters(column.dataIndex)" 
      :selectedList="selectedKeys" @select-change="setSelectedKeys" @confirm="confirm" @reset="clearFilters")
</template>

<script>
import Probs from '../../api/probs'
import { message } from 'ant-design-vue'
import TableSelect from '../../components/TableSelect'

export default {
  name: 'ProbAB',
  components: {
    TableSelect
  },
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
          title: '品名',
          dataIndex: 'food_name',
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.food_name == value
        },
        {
          title: 'activi_status',
          dataIndex: 'activi_status',
          width: 200,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.activi_status == value
        },
        {
          title: 'activi_date',
          dataIndex: 'activi_date',
          width: 200,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.activi_date == value
        }
      ]
    }
  },
  methods: {
    getColFilters(colName) {
      return Array.from(new Set(this.table.map(row => row[colName] || '')))
        .sort()
        .map(col => ({
          label: col,
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
        .single('ab')
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
