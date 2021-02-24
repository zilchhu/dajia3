<template lang="pug">
div
  a-menu(v-model:selectedKeys="menu_keys" theme="light" mode="horizontal")
    a-sub-menu
      template(#title)
        span aggre
      a-menu-item(key="sum:3")
        router-link(:to="{ name: 'sum', params: { day: 7 }}") 营推
      a-menu-item(key="fresh-shop")
        router-link(:to="{ name: 'fresh-shop' }") 新店
      a-menu-item(key="perf:31")
        router-link(:to="{ name: 'perf', params: { day: 31 }}") 绩效

    a-menu-item(key="date")
      a-date-picker(v-model:value="selected_date" @change="date_change" :disabledDate="disabledDate" :allowClear="false" size="small")

    a-sub-menu
      template(#title)
        span users
      a-menu-item(v-for="name in all_names" :key="name")
        router-link(:to="{ name: 'user', params: { username: name, date: $route.params.date || 0 }}") {{name}}

    a-menu-item(key="tools")
      router-link(:to="{ name: 'tools'}") tools

  router-view(v-slot="{ Component }")
    transition
      keep-alive
        component(:is="Component")
</template>

<script>
import User from './api/user'
import dayjs from 'dayjs'
import moment from 'moment'

export default {
  data() {
    return {
      menu_keys: [],
      all_names: [],
      selected_date: moment().subtract(1, 'days')
    }
  },
  methods: {
    fetch_all_names() {
      new User('')
        .all_names()
        .then(res => {
          this.all_names = res
        })
        .catch(err => console.error(err))
    },
    date_change(date, date_str) {
      let date1 = dayjs()
        .startOf('day')
        .diff(dayjs(date_str).startOf('day'), 'day')
      this.$router.replace({ name: 'date', params: { day: date1 } })
    },
    disabledDate(currentDate) {
      return currentDate.isAfter(moment().subtract(1, 'days'))
    }
  },
  mounted() {
    this.fetch_all_names()
  }
}
</script>

<style lang="sass">
::-webkit-scrollbar
  display: block
  width: 10px
  height: 10px
  background: rgba(241,241,241,.7)
  overflow: auto

::-webkit-scrollbar-thumb
  background: rgba(168,168,168,.6)

.ant-table-pagination.ant-pagination
  margin: 6px 0 !important
</style>
