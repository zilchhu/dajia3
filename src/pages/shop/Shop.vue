<template lang="pug">
.shop
  .header
    span.platform {{platform}}
    span.shopid {{shopid}}
    span.shop-name {{shop_name}}
  .content(style="width: 960px;")
    a-spin(:spinning="spinning")
      user-activities(:activities="shops")
  a-back-top
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
    },
    shopid() {
      return this.$route.params.shopid
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
  created() {
    this.fetch_shop_single()
  },
  watch: {
    $route(route) {
      if (route.name == 'shop') this.fetch_shop_single()
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
</style>
