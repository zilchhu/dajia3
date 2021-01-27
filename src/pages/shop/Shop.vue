<template lang="pug">
.shop
  .header
    span.platform {{platform}}
    span.shopid {{shopid}}
    span.shop-name {{shop_name}}
  .content(style="width: 960px;")
    a-spin(:spinning="spinning")
      //- .title-meta(v-if="history_one.a.length == 0 && history_one.qs.length > 0")
      //-   div
      //-     span.txt today
      //-   div
      //-     a-button(size="small" type="link" @click="history_click") history
      //-     a-button(size="small" type="link" @click="detail_click") detail
      //- div(v-if="history_one.a.length == 0 && history_one.qs.length > 0")
      //-   shop-form-simple(:as="shop_as" :shop_meta="shop_meta")
      //-   shop-data(v-if="shop_data_show" :shop_data="shop_data")
      //-   shop-history(v-if="shop_history_show" :shopid="shop_meta.shop_id")
      user-activities(:activities="shops")
  a-back-top
</template>

<script>
import { message } from 'ant-design-vue'
import Shop from '../../api/shop'
import UserActivities from '../user/UserActivities'
import ShopFormSimple from '../../components/shop/ShopFormSimple'
import ShopData from '../../components/shop/ShopData'
import ShopHistory from '../../components/shop/ShopHistory'

export default {
  name: 'shop',
  components: {
    UserActivities,
    ShopFormSimple,
    ShopData,
    ShopHistory
  },
  data() {
    return {
      spinning: false,
      shops: [],
      shop_data_show: false,
      shop_history_show: false,
      history_one: {
        a: [],
        qs: []
      }
    }
  },
  computed: {
    shop_name() {
      return this.shops.length > 0 ? this.shops[0].shop_name : ''
    },
    platform() {
      return this.shops.length > 0 ? this.shops[0].platform : ''
    },
    shopid() {
      return this.$route.params.shopid
    },
    shop_meta() {
      return {
        id: this.history_one.id,
        shop_id: this.history_one.shop_id,
        shop_name: this.history_one.shop_name,
        platform: this.history_one.platform
      }
    },
    shop_as() {
      return this.history_one.qs.map(q => ({
        a: '',
        name: this.history_one.person,
        operation: 'save',
        q: q.type,
        time: '',
        time_parsed: '',
        value: q.value,
        threshold: q.threshold
      }))
    },
    shop_data() {
      return {
        third_send: this.history_one.third_send,
        orders: this.history_one.orders,
        income: this.history_one.income,
        income_avg: this.history_one.income_avg,
        income_sum: this.history_one.income_sum,
        cost: this.history_one.cost,
        cost_avg: this.history_one.cost_avg,
        cost_sum: this.history_one.cost_sum,
        cost_ratio: this.history_one.cost_ratio,
        cost_sum_ratio: this.history_one.cost_sum_ratio,
        consume: this.history_one.consume,
        consume_avg: this.history_one.consume_avg,
        consume_sum: this.history_one.consume_sum,
        consume_ratio: this.history_one.consume_ratio,
        consume_sum_ratio: this.history_one.consume_sum_ratio,
        settlea_30: this.history_one.settlea_30,
        settlea_1: this.history_one.settlea_1,
        settlea_7: this.history_one.settlea_7,
        settlea_7_3: this.history_one.settlea_7_3,
        income_score: this.history_one.income_score,
        consume_score: this.history_one.consume_score,
        cost_score: this.history_one.cost_score,
        score: this.history_one.score,
        date: this.history_one.date
      }
    }
  },
  methods: {
    fetch_shop_single() {
      this.spinning = true
      new Shop(this.shopid)
        .single()
        .then(res => {
          this.shops = res
          this.spinning = false
        })
        .catch(e => {
          console.error(e)
          message.error(e)
          this.spinning = false
        })
    },
    fetch_shop_history_one() {
      this.spinning = true
      new Shop(this.shopid)
        .single_history(true)
        .then(res => {
          this.history_one = res
          this.spinning = false
        })
        .catch(e => {
          console.error(e)
          message.error(e)
          this.spinning = false
        })
    },
    init() {
      this.fetch_shop_single()
      this.fetch_shop_history_one()
    },
    detail_click() {
      this.shop_data_show = !this.shop_data_show
    },
    history_click() {
      this.shop_history_show = !this.shop_history_show
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route(route) {
      if (route.name == 'shop') this.init()
    }
  }
}
</script>

<style lang="sass" scoped>
.shop
  display: flex
  width: 100%
  min-height: 100vh
  flex-direction: column
  align-items: center
  background: #fbfbfb

.header
  display: flex
  max-width: 960px
  width: 100%
  height: 60px
  padding: 12px
  justify-content: flex-start
  align-items: center
  font-size: 1.1em

.platform, .shopid
  padding-right: 20px

.title-meta
  display: flex
  justify-content: space-between
  align-items: center

.ant-btn-link
  font-size: 9px
  color: rgba(0, 0, 0, 0.38)

.txt
  padding: 0 8px
  font-size: 10px
  color: rgba(0, 0, 0, 0.38)
</style>
