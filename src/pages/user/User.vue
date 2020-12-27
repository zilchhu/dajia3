<template lang="pug">
.user
  h3.header {{username}}
  a-tabs(@tabClick="tab_click")
    a-tab-pane(key="1" :tab="tab_activities")
      a-spin(:spinning="spinning")
        user-activities(:activities="user.activities")
    a-tab-pane(key="2" :tab="tab_responsibles")
    a-tab-pane(key="3" :tab="tab_success")
    a-tab-pane(key="4" :tab="tab_unimproved")
    a-tab-pane(key="5" :tab="tab_improved")
    a-tab-pane(key="6" :tab="tab_improving")
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
      user: {
        counts: {
          responsibles: {
            count_a: 0,
            count_q: 0,
            count_shop: 0,
            count_shop_a: 0
          },
          success: {
            count_a: 0,
            count_q: 0,
            count_shop: 0,
            count_shop_a: 0
          },
          failure: {
            unimproved: {
              count_a: 0,
              count_q: 0,
              count_shop: 0,
              count_shop_a: 0
            },
            improved: {
              count_a: 0,
              count_q: 0,
              count_shop: 0,
              count_shop_a: 0
            },
            improving: {
              count_a: 0,
              count_q: 0,
              count_shop: 0,
              count_shop_a: 0
            }
          },
          activities: {
            count_a: 0,
            count_shop: 0
          }
        }
      },
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
    },
    tab_activities() {
      let t = this.user.counts.activities
      return `activities ${t.count_a}/${t.count_shop}`
    },
    tab_responsibles() {
      let t = this.user.counts.responsibles
      return `responsibles ${t.count_a}/${t.count_q}/${t.count_shop}/${t.count_shop_a}`
    },
    tab_success() {
      let t = this.user.counts.success
      return `success ${t.count_shop}`
    },
    tab_unimproved() {
      let t = this.user.counts.failure.unimproved
      return `unimproved ${t.count_q}/${t.count_shop}`
    },
    tab_improved() {
      let t = this.user.counts.failure.improved
      return `improved ${t.count_a}/${t.count_shop}`
    },
    tab_improving() {
      let t = this.user.counts.failure.improving
      return `improving ${t.count_a}/${t.count_q}/${t.count_shop}/${t.count_shop_a}`
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
