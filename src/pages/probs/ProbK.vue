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

  template(#handle="{text, record}")
    a-input(:value="text" @change="e => handleChange(e.target.value, record)" size="small")
</template>

<script>
import Probs from '../../api/probs'
import { message } from 'ant-design-vue'

export default {
  name: 'ProbK',
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
          dataIndex: 'category_name',
          width: 140,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.category_name == value
        },
        {
          title: '品名',
          dataIndex: 'name',
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.name == value
        },
        {
          title: '原价',
          dataIndex: 'originalPrice',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.originalPrice) - this.toNum(b.originalPrice)
        },
        {
          title: '折扣价',
          dataIndex: 'price',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.price) - this.toNum(b.price)
        },
        {
          title: '餐盒费',
          dataIndex: 'package_fee',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.package_fee) - this.toNum(b.package_fee)
        },
        {
          title: '起购数',
          dataIndex: 'min_purchase_quantity',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.min_purchase_quantity) - this.toNum(b.min_purchase_quantity)
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
        .single('k')
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
          .save('k', record.key, target['handle'])
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
