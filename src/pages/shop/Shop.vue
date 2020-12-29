<template lang="pug">
.shop
  .header
    span.platform {{platform}}
    span.shopid {{shopid}}
    span.shop-name {{shop_name}}
  .content(style="width: 960px;")
    a-spin(:spinning="spinning")
      user-activities(:activities="shops")
</template>

<script>
import { message } from 'ant-design-vue'
import UserActivities from '../user/UserActivities'
import Shop from '../../api/shop'

export default {
  name: 'shop',
  components: {
    UserActivities
  },
  props: ['shopid'],
  data() {
    return {
      spinning: false,
      shops: []
    }
  },
  computed: {
    shop_name() {
      return this.shops.length > 0 ? this.shops[0].shop_name : ''
    },
    platform() {
      return this.shops.length > 0 ? this.shops[0].platform : ''
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
    }
  },
  mounted() {
    this.fetch_shop_single()
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

.platform
  flex-basis: 80px

.shopid
  flex-basis: 90px
</style>
