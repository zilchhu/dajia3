<template lang="pug">
a-table(:columns="tableCols" :data-source="table" rowKey="shop_id" :loading="tableLoading" @expand="expand" :pagination="{showSizeChanger: true, defaultPageSize: 20}" size="small" :scroll="{x: scrollX}")
  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    a-input-search(:value="selectedKeys[0]" @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])" @search="confirm" style="width: 200px;")
    svg(class="icon icon-reset" aria-hidden="true" @click="clearFilters")
      use(xlink:href="#icon-editdiameterbeifen25x")
  //- template(#income="{text, record}")
  //-   .cell(:class="{unsatisfied: isIncome(text, record)}") {{text}}
  //- template(#incomeAvg="{text, record}")
  //-   .cell(:class="{unsatisfied: isIncomeAvg(text, record)}") {{text}}
  //- template(#consumeRatio="{text, record}")
  //-   .cell(:class="{unsatisfied: isConsumeRatio(text, record)}") {{text}}
  //- template(#costRatio="{text, record}")
  //-   .cell(:class="{unsatisfied: isCostRatio(text, record)}") {{text}}
  //- template(#settlea30="{text, record}")
  //-   .cell(:class="{unsatisfied: isSettlea30(text, record)}") {{text}}
  //- template(#status="{text, record}")
  //-   a-tag(:color="status(text, record).color") {{status(text, record).text}}
  template(#expandedRowRender="{record}")
    a-tabs(@change="change")
      a-tab-pane(key="1" tab="1") 1
      a-tab-pane(key="2" tab="2") 2
      a-tab-pane(key="3" tab="3") 3
</template>

<script>
import { message } from 'ant-design-vue'
import { getTableByDate } from './api'
export default {
  data() {
    return {
      table: [],
      tableLoading: false
    }
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
         filters: this.tableRealShopColFilters,
          filterMultiple: true,
          onFilter: (value, record) => record.real_shop == value
        },
        {
          title: '门店id',
          dataIndex: 'shop_id',
          width: 100,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.shop_id.includes(value.trim())
        },
        {
          title: '店名',
          dataIndex: 'shop_name',
          width: 280,
          slots: { filterDropdown: 'filterDropdown' },
          onFilter: (value, record) => record.shop_name.includes(value.trim())
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
          // width: 100
        },
        {
          title: '收入',
          dataIndex: 'income',
          align: 'right',
          width: 100,
          slots: { customRender: 'income' },
          sorter: (a, b) => this.toNum(a.income) - this.toNum(b.income)
          // width: 100
        },
        {
          title: '平均收入',
          dataIndex: 'income_avg',
          align: 'right',
          width: 100,
          slots: { customRender: 'incomeAvg' },
          sorter: (a, b) => this.toNum(a.income_avg) - this.toNum(b.income_avg)
        },
        // {
        //   title: 'income_sum',
        //   dataIndex: 'income_sum',
        //   align: 'right',
        //   width: 100
        // },
        // {
        //   title: 'cost',
        //   dataIndex: 'cost',
        //   align: 'right',
        //   width: 100
        //   // width: 100
        // },
        // {
        //   title: 'cost_avg',
        //   dataIndex: 'cost_avg',
        //   align: 'right',
        //   width: 100
        // },
        // {
        //   title: 'cost_sum',
        //   dataIndex: 'cost_sum',
        //   align: 'right',
        //   width: 100
        // },
        {
          title: '成本比例',
          dataIndex: 'cost_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'costRatio' },
          sorter: (a, b) => this.toNum(a.cost_ratio) - this.toNum(b.cost_ratio)
        },
        // {
        //   title: 'cost_sum_ratio',
        //   dataIndex: 'cost_sum_ratio',
        //   align: 'right',
        //   width: 100
        // },
        // {
        //   title: 'consume',
        //   dataIndex: 'consume',
        //   align: 'right',
        //   width: 100
        //   // width: 100
        // },
        // {
        //   title: 'consume_avg',
        //   dataIndex: 'consume_avg',
        //   align: 'right',
        //   width: 100
        // },
        // {
        //   title: 'consume_sum',
        //   dataIndex: 'consume_sum',
        //   align: 'right',
        //   width: 100
        // },
        {
          title: '推广比例',
          dataIndex: 'consume_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'consumeRatio' },
          sorter: (a, b) => this.toNum(a.consume_ratio) - this.toNum(b.consume_ratio)
        },
        // {
        //   title: 'consume_sum_ratio',
        //   dataIndex: 'consume_sum_ratio',
        //   align: 'right',
        //   width: 100
        // },
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
          title: '状态',
          dataIndex: 'op_id',
          align: 'center',
          width: 70,
          slots: { customRender: 'status' }
        },
        // {
        //   title: 'income_score',
        //   dataIndex: 'income_score',
        //   align: 'right',
        //   width: 100
        // },
        // {
        //   title: 'cost_score',
        //   dataIndex: 'cost_score',
        //   align: 'right',
        //   width: 100
        // },
        // {
        //   title: 'consume_score',
        //   dataIndex: 'consume_score',
        //   align: 'right',
        //   width: 100
        // },
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
    scrollX() {
      return this.tableCols.reduce((sum, { width }) => sum + width, 50)
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
    getColFilters(colName) {
      return Array.from(new Set(this.table.map(row => row[colName]))).map(col => ({ text: col, value: col }))
    },
    expand(expanded, record) {
      if(expanded) {
        console.log(record)
      }
    },
    change(activeKey) {
      console.log(activeKey)
    },
    toNum(str) {
      try {
        return parseFloat(str)
      } catch (error) {
        return 0
      }
    }
  },
  mounted() {
    this.getTableByDate()
  }
}
</script>
