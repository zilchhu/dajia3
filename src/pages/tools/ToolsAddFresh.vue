<template lang="pug">
.add-fresh
  .header
    span.title add-new-shop
  .form
    a-form(:model="formState" :label-col="{span: 4}" :wrapper-col="{span: 14}")
      a-form-item(label="平台")
        a-radio-group(v-model:value="formState.platform" @change="platformChange")
          a-radio(:value="1") 美团
          a-radio(:value="2") 饿了么
      a-form-item(label="门店")
        a-select(v-model:value="formState.shop" showSearch :filterOption="filterShop" placeholder="请选择门店")
          a-select-option(v-for="shop in selectedShops" :key="shop.id" :value="`${shop.id}|${shop.name}|${shop.city}`") {{shop.id}} {{shop.name}} {{shop.city}}
      
</template>

<script>
import Shop from '../../api/shop'
import { message } from 'ant-design-vue'

export default {
  name: 'tools-add-fresh',
  data() {
    return {
      formState: {
        platform: 1,
        shop: ''
      },
      mtShops: [],
      elmShops: [],
      loading: false
    }
  },
  computed: {
    selectedShops() {
      return this.formState.platform == 1 ? this.mtShops.map(v => ({ ...v, name: v.poiName })) : this.elmShops
    }
  },
  methods: {
    fetchMtShops() {
      this.loading = true
      console.log(1)
      new Shop()
        .shops('mt')
        .then(res => {
          this.mtShops = res
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    },
    fetchElmShops() {
      this.loading = true
      new Shop()
        .shops('elm')
        .then(res => {
          this.elmShops = res
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    },
    filterShop(input, option) {
      return option.props.value.includes(input.trim())
    },
    platformChange() {
      this.formState.shop = ''
    },
    init() {
      this.fetchMtShops()
      this.fetchElmShops()
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="sass" scoped>
.add-fresh
  width: 100%
  padding: 0 20px

.header
  display: flex
  width: 100%
  justify-content: flex-start
  height: 60px

.title
  font-size: 1.1em
  font-weight: bold
</style>
