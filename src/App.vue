<template lang="pug">
template(v-if="!table1")
  a-spin
template(v-else-if="table1.err")
  a-alert(type="error" :message="table1.err" show-icon closable)
template(v-else-if="!table1.data")
  a-empty
template(v-else)
  a-table(:columns="cols" :data-source="table1.data" rowKey="shop_id" @expand="expand" :pagination="{pageSize: 30, showSizeChanger: true}" size="small")

    template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
      a-input-search(:value="selectedKeys[0]" @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])" @search="confirm" style="width: 200px;")
      svg(class="icon icon-reset" aria-hidden="true" @click="clearFilters")
        use(xlink:href="#icon-editdiameterbeifen25x")

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
        a-tab-pane(key="today" tab="today")
          a-descriptions(size="small" :column="{ xxl: 5, xl: 4, lg: 4, md: 4, sm: 3, xs: 1 }")
            a-descriptions-item(v-for="key in Object.keys(record)" :key="key" :label="key") {{record[key]}}
        a-tab-pane(key="history", tab="history")
          a-table(:columns="cols2" :data-source="historyTable.data" :loading="historyTableLoading" :pagination="false" size="small")
             template(#expandedRowRender="{record}")
               a-descriptions(size="small" :column="{ xxl: 5, xl: 4, lg: 4, md: 4, sm: 3, xs: 1 }")
                 a-descriptions-item(v-for="key in Object.keys(record)" :key="key" :label="key") {{record[key]}}
      //- template(#wldddpgsr="{text}")
      //-   .cell(:class="{unsatisfied: isWldddpgsr(text)}") {{text}}
      //- template(#tgfbl="{text}")
      //-   .cell(:class="{unsatisfied: isTgfbl(text)}") {{text}}
      //- template(#cbbl="{text}")
      //-   .cell(:class="{unsatisfied: isCbbl(text)}") {{text}}
      //- template(#sr30="{text}")
      //-   .cell(:class="{unsatisfied: isSr30(text)}") {{text}}  
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { cols, cols2 } from './App.model'
import { getHistoryTable } from './api'
import { formatTable } from './store'

export default {
  name: 'App',
  data() {
    return {
      cols,
      cols2,
      searchText: '',
      historyTable: '',
      historyTableLoading: true
    }
  },
  computed: {
    ...mapGetters(['table1'])
  },
  methods: {
    expand(expanded, record) {
      getHistoryTable(2, record.shop_id, 7)
        .then(res => formatTable(res))
        .then(res => {
          this.historyTable = res
          this.historyTableLoading = false
        })
    },
    isIncome(text, record) {
      text = parseFloat(text)
      if (record.platform == '美团') return text < 1500
      else if (record.platform == '饿了么') return text < 1000
      return false
    },
    isIncomeAvg(text) {
      text = parseFloat(text)
      return text < 1500
    },
    isConsumeRatio(text) {
      console.log(text)
      text = parseFloat(text)
      console.log(text)
      return text > 5
    },
    isCostRatio(text) {
      text = parseFloat(text)
      return text > 50
    },
    isSettlea30(text) {
      text = parseFloat(text)
      return text < 70
    },
    // rowClassName(record) {
    //   const is_ =
    //     this.isSr(record.收入, record) ||
    //     this.isWldddpgsr(record.物理店单店平均收入) ||
    //     this.isTgfbl(record.推广费比例) ||
    //     this.isCbbl(record.成本比例) ||
    //     this.isSr30(record.当日收入与30日平均收入比值)
    //   return is_ ? 'unsatisfied-row': 'satisfied-row'
    ...mapActions(['initTable'])
  },
  mounted() {
    this.initTable()
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

.unsatisfied-row
  border-color: #fff2e8
  background-color: #fff2e8

.satisfied-row
  background-color: #f6ffed

.icon-reset
  margin: 0 6px
</style>
