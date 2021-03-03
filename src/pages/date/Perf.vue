<template lang="pug">
div
  a-table(:columns="perf_columns" :data-source="perfs" rowKey="key" :loading="spinning" 
    :pagination="{showSizeChanger: true, defaultPageSize, pageSizeOptions: ['40', '80', '160', '320'], size: 'small'}" 
    @change="table_change"
    size="small" :scroll="{x: scrollX, y: scrollY}" bordered)
    template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
      a-row(type="flex")
        a-col(flex="auto")
          a-select(mode="multiple" :value="selectedKeys" @change="setSelectedKeys" :placeholder="`filter ${column.title}`" :style="`min-width: 160px; width: ${240}px;`")
            a-select-option(v-for="option in getColFilters(column.dataIndex)" :key="option.value") {{option.value}} 
        a-col(flex="60px")
          a-button(type="link" @click="confirm") confirm
          br
          a-button(type="link" @click="clearFilters") reset

    template(#person="{text, record}")
        router-link(:to="{ name: 'user', params: { username: text || '-', date: 0 }}" style="color: rgba(0, 0, 0, 0.65);") {{text}}
  a.expo(:href="`http://192.168.3.3:9040/绩效表${yesterday}.xlsx`" target="_blank") export
</template>

<script>
import { message } from 'ant-design-vue'
import Perf from '../../api/perf'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import updateLocale from 'dayjs/plugin/updateLocale'

import 'dayjs/locale/zh-cn'

dayjs.extend(localeData)
dayjs.extend(weekday)
dayjs.extend(updateLocale)

dayjs.locale('zh-cn')

dayjs.updateLocale('zh-cn', {
  weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
})

export default {
  name: 'perf',
  data() {
    return {
      perfs: [],
      spinning: false,
      scrollY: 900,
      defaultPageSize: 40,
      last_perf_route: {path: '/perf/31'}
    }
  },
  computed: {
    day() {
      return this.$route.params.day
    },
    yesterday() {
      return dayjs().subtract(1, 'day').format('YYYYMMDD')
    },
    perf_columns() {
      let fiexed_cols = [
        {
          title: '城市',
          dataIndex: 'city',
          width: 75,
          slots: { filterDropdown: 'filterDropdown' },
          filterMultiple: true,
          fixed: 'left',
          onFilter: (value, record) => record.city == value
        },
        {
          title: '运营',
          dataIndex: 'person',
          width: 75,
          slots: { filterDropdown: 'filterDropdown', customRender: 'person' },
          filterMultiple: true,
          fixed: 'left',
          onFilter: (value, record) => record.person == value
        },
        {
          title: '物理店',
          dataIndex: 'real_shop',
          width: 100,
          slots: { filterDropdown: 'filterDropdown' },
          filterMultiple: true,
          fixed: 'left',
          onFilter: (value, record) => record.real_shop == value
        },
        {
          title: '收入',
          dataIndex: 'income_sum',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.income_sum) - this.toNum(b.income_sum)
        },
        {
          title: '平均收入',
          dataIndex: 'income_avg',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.income_avg) - this.toNum(b.income_avg)
        },
        {
          title: '收入分',
          dataIndex: 'income_score',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.income_score) - this.toNum(b.income_score)
        },
        {
          title: '成本',
          dataIndex: 'cost_sum',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.cost_sum) - this.toNum(b.cost_sum)
        },
        {
          title: '平均成本',
          dataIndex: 'cost_avg',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.cost_avg) - this.toNum(b.cost_avg)
        },
        {
          title: '成本比例',
          dataIndex: 'cost_sum_ratio',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.cost_sum_ratio) - this.toNum(b.cost_sum_ratio)
        },
        {
          title: '总成本比',
          dataIndex: 'cost_sum_sum_ratio',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.cost_sum_sum_ratio) - this.toNum(b.cost_sum_sum_ratio)
        },
        {
          title: '成本分',
          dataIndex: 'cost_score',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.cost_score) - this.toNum(b.cost_score)
        },
        {
          title: '推广',
          dataIndex: 'consume_sum',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.consume_sum) - this.toNum(b.consume_sum)
        },
        {
          title: '平均推广',
          dataIndex: 'consume_avg',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.consume_avg) - this.toNum(b.consume_avg)
        },
        {
          title: '推广比例',
          dataIndex: 'consume_sum_ratio',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.consume_sum_ratio) - this.toNum(b.consume_sum_ratio)
        },
        {
          title: '总推广比',
          dataIndex: 'consume_sum_sum_ratio',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.consume_sum_sum_ratio) - this.toNum(b.consume_sum_sum_ratio)
        },
        {
          title: '推广分',
          dataIndex: 'consume_score',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.consume_score) - this.toNum(b.consume_score)
        },
        {
          title: '分数',
          dataIndex: 'score',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.score) - this.toNum(b.score)
        },
        {
          title: '分数变化',
          dataIndex: 'score_1',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.score_1) - this.toNum(b.score_1)
        },
        {
          title: '平均分',
          dataIndex: 'score_avg',
          align: 'right',
          width: 100,
          sorter: (a, b) => this.toNum(a.score_avg) - this.toNum(b.score_avg)
        },
        {
          title: '平均分变化',
          dataIndex: 'score_avg_1',
          align: 'right',
          width: 110,
          sorter: (a, b) => this.toNum(a.score_avg_1) - this.toNum(b.score_avg_1)
        },
        {
          title: '日期',
          dataIndex: 'date',
          align: 'right',
          fixed: 'right',
          slots: { filterDropdown: 'filterDropdown' },
          defaultFilteredValue: [+dayjs().subtract(1, 'day').format('YYYYMMDD')],
          width: 100,
          onFilter: (value, record) => record.date == value
        }
      ]
      return [...fiexed_cols]
    },
    scrollX() {
      let x = this.reduce_width(this.perf_columns)
      return x
    }
  },
  methods: {
    reduce_width(nodes) {
      return nodes.reduce((sw, c) => {
        if (c.width) return sw + c.width
        if (c.children) return sw + this.reduce_width(c.children)
        return sw
      }, 10)
    },
    toNum(str) {
      try {
        return parseFloat(str)
      } catch (error) {
        return 0
      }
    },
    getColFilters(colName) {
      return Array.from(new Set(this.perfs.map(row => row[colName]))).map(col => ({
        text: col,
        value: col
      }))
    },
    fetch_perf() {
      this.spinning = true
      new Perf(this.day)
        .single()
        .then(res => {
          this.perfs = res
          this.spinning = false
        })
        .catch(e => {
          console.error(e)
          message.error(e)
          this.spinning = false
        })
    },
    table_change(pagination) {
      localStorage.setItem('perf/defaultPageSize', pagination.pageSize)
    }
  },
  created() {
    this.scrollY = document.body.clientHeight - 126
    this.defaultPageSize = +localStorage.getItem('perf/defaultPageSize') || 40
    this.fetch_perf()
  },
  watch: {
    $route(route) {
      if (route.name == 'perf') {
        this.defaultPageSize = +localStorage.getItem('perf/defaultPageSize') || 40
        if (route.path != this.last_perf_route.path) {
          this.fetch_perf()
        }
        this.last_perf_route = route
      }
    }
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

.expo
  display: block
  position: absolute
  bottom: 10px
  left: 10px
  z-index: 100
</style>
