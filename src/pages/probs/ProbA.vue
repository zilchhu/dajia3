<template lang="pug">
a-table.ant-table-change(:columns="columns" :data-source="table" rowKey="key" :loading="loading" 
  :pagination="{showSizeChanger: true, defaultPageSize: 100, pageSizeOptions: ['50', '100', '200', '400'], size: 'small'}" 
  size="small" :scroll="{y: scrollY}" :rowClassName="(record, index) => (index % 2 === 1 ? 'table-striped' : null)")

  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    //- a-row(type="flex")
    //-   a-col(flex="auto")
    //-     a-select(mode="multiple" :value="selectedKeys" @change="onSelectChange" :placeholder="`filter ${column.title}`" :style="`min-width: 160px; width: ${column.width || 220}px;`")
    //-       a-select-option(v-for="option in getColFilters(column.dataIndex)" :key="option.value") {{option.value}} 
    //-   a-col(flex="60px")
    //-     a-button(type="link" @click="confirm") confirm
    //-     br
    //-     a-button(type="link" @click="clearFilters") reset
    //- p {{selectedKeys}}
    table-select(:style="`min-width: 160px; width: ${column.width || 220}px;`" :filterOptions="getColFilters(column.dataIndex)" 
      :selectedList="selectedKeys" @select-change="setSelectedKeys" @confirm="confirm" @reset="clearFilters")

  template(#handle="{text, record}")
    a-input(:value="text" @change="e => handleChange(e.target.value, record)" size="small")
</template>

<script>
import Probs from '../../api/probs'
import { message } from 'ant-design-vue'
import TableSelect from '../../components/TableSelect'

export default {
  name: 'ProbA',
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
          dataIndex: '门店id',
          width: 90,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.门店id == value
        },
        {
          title: '门店',
          dataIndex: '门店',
          width: 250,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.门店 == value
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
          title: '负责',
          dataIndex: 'person',
          width: 70,
          slots: { filterDropdown: 'filterDropdown', customRender: 'person' },
          onFilter: (value, record) => record.person == value
        },
        {
          title: '物理店',
          dataIndex: 'real_shop_name',
          width: 100,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.real_shop_name == value
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
          title: '折扣价',
          dataIndex: '折扣价',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.折扣价) - this.toNum(b.折扣价)
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
      return Array.from(new Set(this.table.map(row => row[colName]))).map(col => ({
        label: col || '',
        value: col || ''
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
        .single('a')
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
          .save('a', record.key, target['handle'])
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            message.error(err)
          })
      }
    },
    onSelectChange(checks) {
      console.log(checks)
    }
  },
  created() {
    this.scrollY = document.body.clientHeight - 176
    this.debounce_save = this.debounce(this.save)
    this.fetchTable()
  }
}
</script>
