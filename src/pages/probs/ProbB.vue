<template lang="pug">
a-table.ant-table-change(:columns="columns" :data-source="table" rowKey="key" :loading="loading" 
  :pagination="{showSizeChanger: true, defaultPageSize: 100, pageSizeOptions: ['50', '100', '200', '400'], size: 'small'}" 
  size="small" :scroll="{y: scrollY}" :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)")

  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    table-select(:style="`min-width: 160px; width: ${column.width + 50 || 300}px;`" :filterOptions="getColFilters(column.dataIndex)" 
      :selectedList="selectedKeys" @select-change="setSelectedKeys" @confirm="confirm" @reset="clearFilters")

  template(#handle="{text, record}")
    a-input(:value="text" @change="e => handleChange(e.target.value, record)" size="small")
</template>

<script>
import Probs from '../../api/probs'
import { message } from 'ant-design-vue'
import TableSelect from '../../components/TableSelect'

export default {
  name: 'ProbB',
  components: {
    TableSelect
  },
  data() {
    return {
      table: [],
      loading: false,
      scrollY: 900,
      debounce_save: null
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
        },
        {
          title: '处理',
          dataIndex: 'handle',
          filters: [
            { text: '已处理', value: '' },
            { text: '未处理', value: '1' }
          ],
          filterMultiple: true,
          slots: { customRender: 'handle' },
          onFilter: (value, record) => (record?.handle == null) == Boolean(value)
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
        .single('b')
        .then(res => {
          this.table = res
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    },
    debounce(fn) {
      let timeout = null
      return function() {
        clearTimeout(timeout)
        timeout = setTimeout(() => fn.apply(this, arguments), 800)
      }
    },
    handleChange(value, record) {
      const target = this.table.filter(item => record.key === item.key)[0]
      if (target) {
        target['handle'] = value
        this.debounce_save(record)
      }
    },
    save(record) {
      const target = this.table.filter(item => record.key === item.key)[0]
      if (target) {
        new Probs()
          .save('b', record.key, target['handle'])
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            message.error(err)
          })
      }
    }
  },
  created() {
    this.scrollY = document.body.clientHeight - 176
    this.debounce_save = this.debounce(this.save)
    this.fetchTable()
  }
}
</script>
