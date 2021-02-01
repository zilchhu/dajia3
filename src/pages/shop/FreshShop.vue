<template lang="pug">
a-table(:columns="fresh_shop_columns" :data-source="fresh_shop_data.shops" rowKey="key" :loading="spinning" 
  :pagination="{showSizeChanger: true, defaultPageSize: 34, pageSizeOptions: ['34', '68', '136', '272'], size: 'small'}" size="small" :scroll="{x: scrollX, y: scrollY}" bordered)
  template(#filterDropdown="{confirm, clearFilters, column, selectedKeys, setSelectedKeys}")
    a-row(type="flex")
      a-col(flex="auto")
        a-select(mode="multiple" :value="selectedKeys" @change="setSelectedKeys" :placeholder="`filter ${column.title}`" :style="`min-width: 160px; width: ${240}px;`")
          a-select-option(v-for="option in getColFilters(column.dataIndex)" :key="option.value") {{option.value}} 
      a-col(flex="60px")
        a-button(type="link" @click="confirm") confirm
        br
        a-button(type="link" @click="clearFilters") reset

    
  template(#value="{text, record}")
    .cell(:class="{unsatisfied: isUnsatisfy(record, text)}") {{text}}

  template(#field="{text, record}")
    .cell(:title="record.name") {{text}}

</template>

<script>
import { message } from 'ant-design-vue'
import FreshShop from '../../api/fresh-shop'
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
  name: 'fresh-shop',
  data() {
    return {
      fresh_shop_data: {
        dates: [],
        shops: []
      },
      spinning: false,
      scrollY: 900
    }
  },
  computed: {
    fresh_shop_columns() {
      let fiexed_cols = [
        {
          title: '门店',
          dataIndex: 'name',
          width: 75,
          slots: { filterDropdown: 'filterDropdown' },
          filterMultiple: true,
          fixed: 'left',
          customRender: ({ text, index }) => {
            const obj = {
              children: <div style="writing-mode: vertical-lr; white-space: pre-wrap">{text}</div>,
              props: {}
            }
            if (index % 17 == 0) {
              obj.props.rowSpan = 17
            } else {
              obj.props.rowSpan = 0
            }
            return obj
          },
          onFilter: (value, record) => record.name == value
        },
        {
          title: '项目',
          dataIndex: 'field',
          width: 100,
          filters: this.getColFilters('field'),
          filterMultiple: true,
          fixed: 'left',
          slots: { customRender: 'field' },
          onFilter: (value, record) => record.field == value
        }
      ]
      let dates_cols = this.fresh_shop_data.dates.map(v => ({
        title: dayjs(v, 'YYYYMMDD').format('M/D'),
        dataIndex: v,
        align: 'right',
        width: 80,
        slots: { customRender: 'value' }
        // sorter: (a, b) => this.toNum(a[v]) - this.toNum(b[v])
      }))
      // console.log([...fiexed_cols, ...dates_cols])
      return [...fiexed_cols, ...dates_cols]
    },
    scrollX() {
      let x = this.reduce_width(this.fresh_shop_columns)
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
      return Array.from(new Set(this.fresh_shop_data.shops.map(row => row[colName]))).map(col => ({
        text: col,
        value: col
      }))
    },
    fetch_fresh_shop() {
      this.spinning = true
      new FreshShop()
        .single()
        .then(res => {
          this.fresh_shop_data = res
          this.spinning = false
        })
        .catch(e => {
          console.error(e)
          message.error(e)
          this.spinning = false
        })
    },
    isUnsatisfy(record, text) {
      if(record.field == '评论数') return this.toNum(text) < 20
      if(record.field == '评分') return this.toNum(text) < 4.8
      if(record.field == '推广') return this.toNum(text) < 50 || this.toNum(text) > 150
      if(record.field == '客单价') return this.toNum(text) < 12 
      if(record.field == '曝光量') return this.toNum(text) < 3000
      if(record.field == '进店率') return this.toNum(text) < 8
      if(record.field == '下单率') return this.toNum(text) < 25
      if(record.field == '下架产品量') return this.toNum(text) > 5
      if(record.field == '下架产品量') return this.toNum(text) > 5
      if(record.field == '商圈排名') return this.toNum(text) > 2
      if(record.field == '延迟发单') return this.toNum(text) < 5
    }
  },
  mounted() {
    this.scrollY = document.body.clientHeight - 124
    this.fetch_fresh_shop()
  },
  watch: {
    $route(route) {
      if (route.name == 'freshshop') {
        this.fetch_fresh_shop()
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
</style>
