<template lang="pug">
a-list-item(:key="activity.time")
  a-list-item-meta
    template(#title)
      p.title {{title}}
      span.num {{title_num}}
      span.time {{title_time}}
      span.time {{activity.time}}
    template(#description)
      shop-form(:as="activity.as" :shop_meta="shop_meta")
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

export default {
  name: 'activity-card',
  components: {
    ShopForm
  },
  props: {
    activity: Object
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
    title_time() {
      return dayjs().from(this.activity.time_parsed)
    }
  },
  methods: {}
}
</script>

<style lang="sass" scoped>
.title
  font-size: 1.1em
  font-weight: bold
  margin: 0

.num, .time
  font-size: 10px
  color: rgba(0, 0, 0, 0.38)
  margin: 4px 16px 10px 0

.ant-list-split, .ant-list-item 
  border: none

.ant-list-item 
  padding: 12px
</style>
