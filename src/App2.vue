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

  template(v-for="col in rules.map(r=>r[0])" #[col]="{text, record}")
    .cell(:class="{unsatisfied: rules2fn[record.platform][col](text)}") {{text}}
 

  template(#expandedRowRender="{record}")
    a-tabs(size="small")
      //- a-tab-pane(key="1" tab="1") 1
      a-tab-pane(key="1" tab="往日" size="small") 
        a-table(:columns="shopTableCols" :data-source="tablesByShop.get(record.shop_id)" rowKey="date" :loading="tablesByShopLoading.has(record.shop_id)" :pagination="{showSizeChanger: true, defaultPageSize: 10}" size="small" :scroll="{x: shopScrollX}")
          template(v-for="col in rules.map(r=>r[0])" #[col]="{text, record}")
            .cell(:class="{unsatisfied: rules2fn[record.platform][col](text)}") {{text}}

          template(#expandedRowRender="{record}")
            a-tabs(size="small")
              a-tab-pane(:key="`${record.id}`-1" tab="方案" size="small")
                hello-form2(:record="record" @save="onSave")
              a-tab-pane(:key="`${record.id}`-2" tab="详情" size="small")
                a-card(style="width: 100vw;" size="small")
                  a-tooltip(v-for="key in Object.keys(record).filter(v=>v!='a')" :key="key")
                    template(#title)
                      .tip {{`${record[key]}${thresholdSuffix(key)}`}}
                    a-card-grid(style="width: 160px; padding: 4px 10px;")
                      a-statistic(:title="en2zh.get(key)" :value="record[key]" valueStyle="font-size: 1em;")
                        template(v-if="rules.map(r=>r[0]).includes(key)" #formatter="{value}")
                          p.truncate(:class="{unsatisfied: rules2fn[record.platform][key](value)}") {{value}}
                        template(v-else #formatter="{value}")
                          p.truncate {{value}}

      a-tab-pane(key="2" tab="详情")
        a-card(style="width: 100vw;" size="small")
          a-tooltip(v-for="key in Object.keys(record).filter(v=>v!='a')" :key="key")
            template(#title)
              .tip {{`${record[key]}${thresholdSuffix(key)}`}}
            a-card-grid(style="width: 160px; padding: 4px 10px;")
              a-statistic(:title="en2zh.get(key)" :value="record[key]" valueStyle="font-size: 1em;")
                template(v-if="rules.map(r=>r[0]).includes(key)" #formatter="{value}")
                  p.truncate(:class="{unsatisfied: rules2fn[record.platform][key](value)}") {{value}}
                //- template(v-else-if="key == 'score'")
                //-   p.truncate(:class="{success: value == 100}") {{value}}
                template(v-else #formatter="{value}")
                  p.truncate {{value}}

        
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
      tableLoading: false,
      rules: [
        ['income', '<', 1500],
        ['income_avg', '<', 1500],
        ['consume_ratio', '>', 5],
        ['cost_ratio', '>', 50],
        ['settlea_30', '<', 70]
      ],
      mtRules: [['income', '<', 1500]],
      elmRules: [['income', '<', 1000]]
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
          slots: { customRender: 'income_avg' },
          sorter: (a, b) => this.toNum(a.income_avg) - this.toNum(b.income_avg)
        },
        {
          title: '成本比例',
          dataIndex: 'cost_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'cost_ratio' },
          sorter: (a, b) => this.toNum(a.cost_ratio) - this.toNum(b.cost_ratio)
        },
        {
          title: '推广比例',
          dataIndex: 'consume_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'consume_ratio' },
          sorter: (a, b) => this.toNum(a.consume_ratio) - this.toNum(b.consume_ratio)
        },
        {
          title: '比30日',
          dataIndex: 'settlea_30',
          align: 'right',
          width: 100,
          slots: { customRender: 'settlea_30' },
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
          slots: { customRender: 'income_avg' },
          sorter: (a, b) => this.toNum(a.income_avg) - this.toNum(b.income_avg)
        },
        {
          title: '成本比例',
          dataIndex: 'cost_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'cost_ratio' },
          sorter: (a, b) => this.toNum(a.cost_ratio) - this.toNum(b.cost_ratio)
        },
        {
          title: '推广比例',
          dataIndex: 'consume_ratio',
          align: 'right',
          width: 100,
          slots: { customRender: 'consume_ratio' },
          sorter: (a, b) => this.toNum(a.consume_ratio) - this.toNum(b.consume_ratio)
        },
        {
          title: '比30日',
          dataIndex: 'settlea_30',
          align: 'right',
          width: 100,
          slots: { customRender: 'settlea_30' },
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
          align: 'left',
          sorter: (a, b) => this.toNum(a.date) - this.toNum(b.date)
        }
      ]
    },
    scrollX() {
      return this.tableCols.reduce((sum, { width }) => sum + width, 50)
    },
    shopScrollX() {
      return this.shopTableCols.reduce((sum, { width }) => sum + width, 50)
    },
    en2zh() {
      const map = new Map()
      map.set('id', 'id')
      map.set('city', '城市')
      map.set('person', '负责')
      map.set('real_shop', '物理店')
      map.set('shop_id', '门店id')
      map.set('shop_name', '店名')
      map.set('platform', '平台')
      map.set('third_send', '三方配送')
      map.set('income', '收入')
      map.set('income_avg', '平均收入')
      map.set('income_sum', '总收入')
      map.set('cost', '成本')
      map.set('cost_avg', '平均成本')
      map.set('cost_sum', '总成本')
      map.set('cost_ratio', '成本比例')
      map.set('cost_sum_ratio', '总成本比例')
      map.set('consume', '推广')
      map.set('consume_avg', '平均推广')
      map.set('consume_sum', '总推广')
      map.set('consume_ratio', '推广比例')
      map.set('consume_sum_ratio', '总推广比例')
      map.set('settlea_30', '比30日')
      map.set('settlea_1', '比昨日')
      map.set('settlea_7', '比上周')
      map.set('settlea_7_3', '比上周(3日)')
      map.set('income_score', '收入分')
      map.set('consume_score', '推广分')
      map.set('cost_score', '成本分')
      map.set('score', '总分')
      map.set('date', '日期')
      return map
    },
    rules2fn() {
      let mt = [...this.rules, ...this.mtRules]
      let elm = [...this.rules, ...this.elmRules]
      const fnBody = r => `
      let v = 0  
      try {
        v = parseFloat(val)
      } catch (e) { console.error(e) }
      return v ${r[1]} ${r[2]}`
      mt = mt.reduce((o, r) => {
        return {
          ...o,
          [r[0]]: new Function('val', fnBody(r))
        }
      }, {})
      elm = elm.reduce((o, r) => {
        return {
          ...o,
          [r[0]]: new Function('val', fnBody(r))
        }
      }, {})
      return {
        美团: mt,
        饿了么: elm
      }
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
    thresholdSuffix(name) {
      let rule = this.rules.find(v => v[0] == name)
      if(!rule) return ''
      let needPercent = ['consume_ratio', 'cost_ratio', 'settlea_30'].includes(rule[0]) ? '%': ''
      return ` / ${rule[2]}${needPercent}`
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

.success
  color: #52c41a

.threshold
  color: black

.unsatisfied-row
  border-color: #fff2e8
  background-color: #fff2e8

.satisfied-row
  background-color: #f6ffed

.icon-reset
  margin: 0 6px

.truncate
  width: 120px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
</style>
