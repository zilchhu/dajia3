<template lang="pug">
a-table(:columns="tableCols" :data-source="table" rowKey="shop_id" :loading="tableLoading" @expand="expand" :pagination="{showSizeChanger: true, defaultPageSize: 20}" size="small" :scroll="{x: scrollX}")
  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    a-row(type="flex")
      a-col(flex="auto")
        a-select(mode="multiple" :value="selectedKeys" @change="setSelectedKeys" :placeholder="`filter ${column.title}`" :style="`min-width: 160px; width: ${column.width}px;`")
          a-select-option(v-for="option in getColFilters(column.dataIndex)" :key="option.value") {{option.value}} 
      a-col(flex="60px")
        a-button(type="link" @click="confirm") confirm
        br
        a-button(type="link" @click="clearFilters") reset

  template(#income="{text, record}")
    .cell(:class="{unsatisfied: isIncome(text, record)}") {{text}}
  template(#incomeAvg="{text, record}")
    .cell(:class="{unsatisfied: isIncomeAvg(text, record)}") {{text}}
  template(#consumeRatio="{text, record}")
    .cell(:class="{unsatisfied: isConsumeRatio(text, record)}") {{text}}
  template(#costRatio="{text, record}")
    .cell(:class="{unsatisfied: isCostRatio(text, record)}") {{text}}
  template(#settlea30="{text, record}")
    .cell(:class="{unsatisfied: isSettlea30(text, record)}") {{text}}

  template(#expandedRowRender="{record}")
    a-tabs
      //- a-tab-pane(key="1" tab="1") 1
      a-tab-pane(key="3" tab="3" size="small") 
        a-table(:columns="shopTableCols" :data-source="tablesByShop.get(record.shop_id)" rowKey="date" :loading="tablesByShopLoading.has(record.shop_id)" :pagination="{showSizeChanger: true, defaultPageSize: 10}" size="small" :scroll="{x: shopScrollX}")
          template(#income="{text, record}")
            .cell(:class="{unsatisfied: isIncome(text, record)}") {{text}}
          template(#incomeAvg="{text, record}")
            .cell(:class="{unsatisfied: isIncomeAvg(text, record)}") {{text}}
          template(#consumeRatio="{text, record}")
            .cell(:class="{unsatisfied: isConsumeRatio(text, record)}") {{text}}
          template(#costRatio="{text, record}")
            .cell(:class="{unsatisfied: isCostRatio(text, record)}") {{text}}
          template(#settlea30="{text, record}")
            .cell(:class="{unsatisfied: isSettlea30(text, record)}") {{text}}

          template(#expandedRowRender="{record}")
            a-descriptions(size="small" :column="{ xxl: 5, xl: 4, lg: 4, md: 4, sm: 3, xs: 1 }")
              a-descriptions-item(v-for="key in Object.keys(record)" :key="key" :label="key") {{record[key]}}


      a-tab-pane(key="2" tab="2")
        a-descriptions(size="small" :column="{ xxl: 5, xl: 4, lg: 4, md: 4, sm: 3, xs: 1 }")
          a-descriptions-item(v-for="key in Object.keys(record)" :key="key" :label="key") {{record[key]}}

      
      a-tab-pane(key="1" tab="1")
        hello-form2(:record="record" @save="onSave")
</template>

<script>
import { message } from 'ant-design-vue'
import { getTableByDate, getTableByShop } from './api'
import HelloForm2 from './components/HelloForm2'
export default {
  data() {
    return {
      table: [],
      tablesByShop: new Map(),
      tablesByShopLoading: new Set(),
      tableLoading: false
    }
  },
  components: {
    HelloForm2
  },
  computed: {
    tablePersonColFilters() {
      return this.getColFilters('person')
    },
    tableCityColFilters() {
      return this.getColFilters('city')
    },
    tableRealShopColFilters() {
      return this.getColFilters('real_shop')
    },
    tableCols() {
      return [
        {
          title: '城市',
          dataIndex: 'city',
          width: 70,
          filters: this.tableCityColFilters,
          filterMultiple: true,
          onFilter: (value, record) => record.city == value
        },
        {
          title: '负责',
          dataIndex: 'person',
          width: 70,
          filters: this.tablePersonColFilters,
          filterMultiple: true,
          onFilter: (value, record) => record.person == value
        },
        {
          title: '物理店',
          dataIndex: 'real_shop',
          width: 100,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.real_shop == value
        },
        {
          title: '门店id',
          dataIndex: 'shop_id',
          width: 100,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.shop_id == value
        },
        {
          title: '店名',
          dataIndex: 'shop_name',
          width: 280,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.shop_name == value
        },
        {
          title: '平台',
          dataIndex: 'platform',
          width: 80,
          filters: [
            { text: '美团', value: '美团' },
            { text: '饿了么', value: '饿了么' }
          ],
          filterMultiple: true,
          onFilter: (value, record) => record.platform == value
        },
        {
          title: '三方配送',
          dataIndex: 'third_send',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.third_send) - this.toNum(b.third_send)
        },
        {
          title: '收入',
          dataIndex: 'income',
          align: 'right',
          width: 100,
          slots: { customRender: 'income' },
          sorter: (a, b) => this.toNum(a.income) - this.toNum(b.income)
        },
        {
          title: '平均收入',
          dataIndex: 'income_avg',
          align: 'right',
          width: 100,
          slots: { customRender: 'incomeAvg' },
          sorter: (a, b) => this.toNum(a.income_avg) - this.toNum(b.income_avg)
        },
        {
          title: '成本比例',
          dataIndex: 'cost_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'costRatio' },
          sorter: (a, b) => this.toNum(a.cost_ratio) - this.toNum(b.cost_ratio)
        },
        {
          title: '推广比例',
          dataIndex: 'consume_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'consumeRatio' },
          sorter: (a, b) => this.toNum(a.consume_ratio) - this.toNum(b.consume_ratio)
        },
        {
          title: '比30日',
          dataIndex: 'settlea_30',
          align: 'right',
          width: 100,
          slots: { customRender: 'settlea30' },
          sorter: (a, b) => this.toNum(a.settlea_30) - this.toNum(b.settlea_30)
        },
        {
          title: '比昨日',
          dataIndex: 'settlea_1',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.settlea_1) - this.toNum(b.settlea_1)
        },
        {
          title: '比上周',
          dataIndex: 'settlea_7',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.settlea_7) - this.toNum(b.settlea_7)
        },
        {
          title: '总分',
          dataIndex: 'score',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.score) - this.toNum(b.score)
        },
        {
          title: '日期',
          dataIndex: 'date',
          align: 'right',
          width: 100
        }
      ]
    },
    shopTableCols() {
      return [
        {
          title: '三方配送',
          dataIndex: 'third_send',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.third_send) - this.toNum(b.third_send)
        },
        {
          title: '收入',
          dataIndex: 'income',
          align: 'right',
          width: 100,
          slots: { customRender: 'income' },
          sorter: (a, b) => this.toNum(a.income) - this.toNum(b.income)
        },
        {
          title: '平均收入',
          dataIndex: 'income_avg',
          align: 'right',
          width: 100,
          slots: { customRender: 'incomeAvg' },
          sorter: (a, b) => this.toNum(a.income_avg) - this.toNum(b.income_avg)
        },
        {
          title: '成本比例',
          dataIndex: 'cost_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'costRatio' },
          sorter: (a, b) => this.toNum(a.cost_ratio) - this.toNum(b.cost_ratio)
        },
        {
          title: '推广比例',
          dataIndex: 'consume_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'consumeRatio' },
          sorter: (a, b) => this.toNum(a.consume_ratio) - this.toNum(b.consume_ratio)
        },
        {
          title: '比30日',
          dataIndex: 'settlea_30',
          align: 'right',
          width: 100,
          slots: { customRender: 'settlea30' },
          sorter: (a, b) => this.toNum(a.settlea_30) - this.toNum(b.settlea_30)
        },
        {
          title: '比昨日',
          dataIndex: 'settlea_1',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.settlea_1) - this.toNum(b.settlea_1)
        },
        {
          title: '比上周',
          dataIndex: 'settlea_7',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.settlea_7) - this.toNum(b.settlea_7)
        },
        {
          title: '总分',
          dataIndex: 'score',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.score) - this.toNum(b.score)
        },
        {
          title: '日期',
          dataIndex: 'date',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.date) - this.toNum(b.date)
        }
      ]
    },
    scrollX() {
      return this.tableCols.reduce((sum, { width }) => sum + width, 50)
    },
    shopScrollX() {
      return this.shopTableCols.reduce((sum, { width }) => sum + width, 50)
    }
  },
  methods: {
    getTableByDate() {
      this.tableLoading = true
      getTableByDate()
        .then(res => {
          this.table = res
          this.tableLoading = false
        })
        .catch(err => {
          message.error(err)
          this.tableLoading = false
        })
    },
    getTableByShop(shopId) {
      this.tablesByShopLoading.add(shopId)
      getTableByShop(shopId)
        .then(res => {
          this.tablesByShop.set(shopId, res)
          this.tablesByShopLoading.delete(shopId)
        })
        .catch(err => {
          message.error(err)
          this.tablesByShopLoading.delete(shopId)
        })
    },
    getColFilters(colName) {
      return Array.from(new Set(this.table.map(row => row[colName]))).map(col => ({ text: col, value: col }))
    },
    expand(expanded, record) {
      if (expanded) {
        console.log(record)
        this.getTableByShop(record.shop_id)
      }
    },
    onSave(id) {
      console.log(id)
      this.getTableByDate()
    },
    toNum(str) {
      try {
        return parseFloat(str)
      } catch (error) {
        return 0
      }
    },
    isIncome(text, record) {
      text = this.toNum(text)
      if (record.platform == '美团') return text < 1500
      else if (record.platform == '饿了么') return text < 1000
      return false
    },
    isIncomeAvg(text) {
      text = this.toNum(text)
      return text < 1500
    },
    isConsumeRatio(text) {
      text = this.toNum(text)
      return text > 5
    },
    isCostRatio(text) {
      text = this.toNum(text)
      return text > 50
    },
    isSettlea30(text) {
      text = this.toNum(text)
      return text < 70
    },
    unSatisfies(record) {
      const { income, income_avg, consume_ratio, cost_ratio, settlea_30, platform } = record
      let list = []
      if (this.isIncome(income, record))
        list.push({
          title: 'income',
          value: income,
          threshold: platform == '美团' ? '1500' : '1000'
        })
      if (this.isIncomeAvg(income_avg))
        list.push({
          title: 'income_avg',
          value: income_avg,
          threshold: '1500',
          problem: 'low_income'
        })
      if (this.isConsumeRatio(consume_ratio))
        list.push({
          title: 'consume_ratio',
          value: consume_ratio,
          threshold: '5%',
          problem: 'high_consume'
        })
      if (this.isCostRatio(cost_ratio))
        list.push({
          title: 'cost_ratio',
          value: cost_ratio,
          threshold: '50%',
          problem: 'high_cost'
        })
      if (this.isSettlea30(settlea_30))
        list.push({
          title: 'settlea_30',
          value: settlea_30,
          threshold: '70%',
          problem: 'low_income'
        })
      return list
    },
    unSatisfiesProblems(record) {
      return Array.from(new Set(this.unSatisfies(record).map(v => v.problem))).join(' ')
    },
    selectChange(value) {
      console.log(value)
    }
  },
  mounted() {
    this.getTableByDate()
  }
}
</script>

<style lang="sass" scoped>
.cell
  display: inline-block
  width: 100%
  text-align: right

.unsatisfied
  color: #fa541c

.threshold
  color: black

.unsatisfied-row
  border-color: #fff2e8
  background-color: #fff2e8

.satisfied-row
  background-color: #f6ffed

.icon-reset
  margin: 0 6px
</style>