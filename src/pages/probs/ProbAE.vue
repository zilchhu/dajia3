<template lang="pug">
a-table.ant-table-change(:columns="columns" :data-source="table" rowKey="key" :loading="loading" 
  :pagination="{showSizeChanger: true, defaultPageSize: 100, pageSizeOptions: ['50', '100', '200', '400'], size: 'small'}" 
  size="small" :scroll="{y: scrollY}" :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)")

  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    table-select(:style="`min-width: 160px; width: ${column.width + 50 || 220}px;`" :filterOptions="getColFilters(column.dataIndex)" 
      :selectedList="selectedKeys" @select-change="setSelectedKeys" @confirm="confirm" @reset="clearFilters")

  template(#rule="{text, record}")
    span.pre {{text}}
</template>

<script>
import Probs from '../../api/probs'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import TableSelect from '../../components/TableSelect'

export default {
  name: 'ProbAE',
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
          sorter: (a, b) => (dayjs(a.结束时间).isBefore(dayjs(b.结束时间)) ? -1 : 1)
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
