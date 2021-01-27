<template lang="pug">
a-table(:columns="sum_columns" :data-source="sum_data.shops" rowKey="real_shop" :loading="spinning" 
  :pagination="{showSizeChanger: true, defaultPageSize: 20, pageSizeOptions: ['20', '40', '80', '160']}" size="small" :scroll="{x: scrollX, y: scrollY}" bordered)
  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    a-row(type="flex")
      a-col(flex="auto")
        a-select(mode="multiple" :value="selectedKeys" @change="setSelectedKeys" :placeholder="`filter ${column.title}`" :style="`min-width: 160px; width: ${column.width}px;`")
          a-select-option(v-for="option in getColFilters(column.dataIndex)" :key="option.value") {{option.value}} 
      a-col(flex="60px")
        a-button(type="link" @click="confirm") confirm
        br
        a-button(type="link" @click="clearFilters") reset
</template>

<script>
import { message } from 'ant-design-vue'
import Sum from '../../api/sum'

export default {
  name: 'sum',
  data() {
    return {
      sum_data: {
        dates: [],
        shops: []
      },
      spinning: false,
      scrollY: 900
    }
  },
  computed: {
    sum_columns() {
      let fiexed_cols = [
        {
          title: '城市',
          dataIndex: 'city',
          width: 70,
          fixed: 'left',
          slots: { filterDropdown: 'filterDropdown' },
          filterMultiple: true,
          onFilter: (value, record) => record.city == value
        },
        {
          title: '负责',
          dataIndex: 'person',
          width: 70,
          fixed: 'left',
          filters: this.getColFilters('person'),
          filterMultiple: true,
          onFilter: (value, record) => record.person == value
        },
        {
          title: '物理店',
          dataIndex: 'real_shop',
          width: 100,
          fixed: 'left',
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.real_shop == value
        }
      ]
      let dates_cols = this.sum_data.dates.map(v => ({
        title: v,
        children: [
          {
            title: '营业收入',
            dataIndex: `income_sum_${v}`,
            align: 'right',
            width: 100,
            sorter: (a, b) => this.toNum(a[`income_sum_${v}`]) - this.toNum(b[`income_sum_${v}`])
          },
          {
            title: '推广费用',
            dataIndex: `consume_sum_${v}`,
            align: 'right',
            width: 100,
            sorter: (a, b) => this.toNum(a[`consume_sum_${v}`]) - this.toNum(b[`consume_sum_${v}`])
          },
          {
            title: '推广比例',
            dataIndex: `consume_sum_ratio_${v}`,
            align: 'right',
            width: 100,
            sorter: (a, b) => this.toNum(a[`consume_sum_ratio_${v}`]) - this.toNum(b[`consume_sum_ratio_${v}`])
          },
          {
            title: '成本',
            dataIndex: `cost_sum_${v}`,
            align: 'right',
            width: 100,
            sorter: (a, b) => this.toNum(a[`cost_sum_${v}`]) - this.toNum(b[`cost_sum_${v}`])
          },
          {
            title: '成本比例',
            dataIndex: `cost_sum_ratio_${v}`,
            align: 'right',
            width: 100,
            sorter: (a, b) => this.toNum(a[`cost_sum_ratio_${v}`]) - this.toNum(b[`cost_sum_ratio_${v}`])
          }
        ]
      }))
      console.log([...fiexed_cols, ...dates_cols])
      return [...fiexed_cols, ...dates_cols]
    },
    scrollX() {
      return this.sum_columns.reduce(
        (sum, { width, children }) => (sum + width ? width : children.reduce((s, { w }) => s + w, 0)),
        50
      )
      // return 3000
    }
  },
  methods: {
    toNum(str) {
      try {
        return parseFloat(str)
      } catch (error) {
        return 0
      }
    },
    getColFilters(colName) {
      return Array.from(new Set(this.sum_data.shops.map(row => row[colName]))).map(col => ({ text: col, value: col }))
    },
    fetch_sum_single() {
      this.spinning = true
      new Sum(3)
        .single()
        .then(res => {
          this.sum_data = res
          this.spinning = false
        })
        .catch(e => {
          console.error(e)
          message.error(e)
          this.spinning = false
        })
    }
  },
  mounted() {
    this.scrollY = document.body.clientHeight - 150
    this.fetch_sum_single()
  }
}
</script>
