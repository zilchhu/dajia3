<template lang="pug">
.user
  h3.header {{username}}
  a-tabs(@tabClick="tab_click")
    a-tab-pane(key="1" tab="activities")
      a-spin(:spinning="spinning")
        user-activities(:activities="user.activities")
    a-tab-pane(key="2" tab="responsibles")
    a-tab-pane(key="3" tab="success")
    a-tab-pane(key="4" tab="unimproved")
    a-tab-pane(key="5" tab="improved")
    a-tab-pane(key="6" tab="improving")
</template>

<script>
import User from '../../api/user'
import { message } from 'ant-design-vue'
import UserActivities from './UserActivities'

export default {
  components: {
    UserActivities
  },
  data() {
    return {
      user: {},
      spinning: false
    }
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetch_user_single()
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true }
    )
  },
  computed: {
    username() {
      return this.$route.params.username
    },
    date() {
      return this.$route.params.date
    }
  },
  methods: {
    fetch_user_single() {
      this.spinning = true
      new User(this.username, this.date)
        .single()
        .then(res => {
          this.user = res
          console.log(res)
          this.spinning = false
        })
        .catch(e => {
          message.error(e)
          this.spinning = false
        })
    },
    tab_click() {
      this.fetch_user_single()
    }
  }
}
</script>

<style lang="sass" scoped>
.user
  display: flex
  flex-direction: column
  align-items: center
  width: 100%
  background: #fbfbfb

.header
  flex-basis: 60px
  line-height: 60px
  text-align: center
  align-self: center
</style>
