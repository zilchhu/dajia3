<template lang="pug">
a-list-item(:key="activity.time")
  a-list-item-meta
    template(#title)
      p.title {{title}}
      .title-meta
        div
          span.num {{title_num}}
          a-button.name(type="link" @click="name_click") {{title_name}}
          span.time {{title_time}}
          span.time {{activity.time}}
        a-button(size="small" type="link" @click="detail_click") detail
    template(#description)
      shop-form(:as="shop_as" :shop_meta="shop_meta")
      shop-data(v-if="shop_data_show" :shop_data="shop_data")
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import localeData from 'dayjs/plugin/localeData'

import 'dayjs/locale/zh-cn'

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(localeData)

dayjs.locale('zh-cn')

import ShopForm from '../shop/ShopForm'
import ShopData from '../shop/ShopData'

export default {
  name: 'activity-card',
  components: {
    ShopForm,
    ShopData
  },
  props: {
    activity: Object
  },
  data() {
    return {
      shop_data_show: false
    }
  },
  computed: {
    title() {
      return this.activity.a
    },
    shop_meta() {
      return {
        id: this.activity.id,
        shop_id: this.activity.shop_id,
        shop_name: this.activity.shop_name,
        platform: this.activity.platform
      }
    },
    title_num() {
      return `#${this.activity.index + 1}`
    },
    title_name() {
      return this.activity.name
    },
    title_time() {
      return dayjs().from(this.activity.time_parsed)
    },
    shop_data() {
      return {
        third_send: this.activity.third_send,
        orders: this.activity.orders,
        income: this.activity.income,
        income_avg: this.activity.income_avg,
        income_sum: this.activity.income_sum,
        cost: this.activity.cost,
        cost_avg: this.activity.cost_avg,
        cost_sum: this.activity.cost_sum,
        cost_ratio: this.activity.cost_ratio,
        cost_sum_ratio: this.activity.cost_sum_ratio,
        consume: this.activity.consume,
        consume_avg: this.activity.consume_avg,
        consume_sum: this.activity.consume_sum,
        consume_ratio: this.activity.consume_ratio,
        consume_sum_ratio: this.activity.consume_sum_ratio,
        settlea_30: this.activity.settlea_30,
        settlea_1: this.activity.settlea_1,
        settlea_7: this.activity.settlea_7,
        settlea_7_3: this.activity.settlea_7_3,
        income_score: this.activity.income_score,
        consume_score: this.activity.consume_score,
        cost_score: this.activity.cost_score,
        score: this.activity.score,
        date: this.activity.date
      }
    },
    shop_as() {
      return this.activity.as.map(a => ({
        ...a,
        value: this.activity.qs.find(q => q.type == a.q).value,
        threshold: this.activity.qs.find(q => q.type == a.q).threshold
      }))
    }
  },
  methods: {
    detail_click() {
      this.shop_data_show = !this.shop_data_show
    },
    name_click() {
      this.$router.push({ name: 'user', params: { username: this.title_name, date: 0 } })
    }
  }
}
</script>

<style lang="sass" scoped>
.title
  font-size: 1.1em
  font-weight: bold
  margin: 0

.title-meta
  display: flex
  justify-content: space-between
  align-items: center

.ant-btn-link
  font-size: 9px
  color: rgba(0, 0, 0, 0.38)

.ant-btn-link:hover
  color: #40a9ff

.num, .name, .time
  font-size: 10px
  color: rgba(0, 0, 0, 0.38)
  margin: 4px 16px 10px 0

.ant-list-split, .ant-list-item
  border: none

.ant-list-item
  padding: 12px
</style>
