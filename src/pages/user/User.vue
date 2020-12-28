<template lang="pug">
.user
  h3.header {{username}}
  a-tabs(v-model:activeKey="activeKey" @tabClick="tab_click" style="max-width: 960px;")
    a-tab-pane(key="1" :tab="tab_activities")
      a-spin(:spinning="spinning")
        user-activities(:activities="activities.activities" @fetchMore="fetch_more_acts")

    a-tab-pane(key="2" :tab="tab_responsibles")
      a-spin(:spinning="spinning")
        user-shops(:shops="user.responsibles" type="responsibles" :counts="user.counts.responsibles")

    a-tab-pane(key="6" :tab="tab_improving")
      a-spin(:spinning="spinning")
        user-shops(:shops="user.failure.improving" type="improving" :counts="user.counts.failure.improving")

    a-tab-pane(key="4" :tab="tab_unimproved")
      a-spin(:spinning="spinning")
        user-shops(:shops="user.failure.unimproved" type="unimproved" :counts="user.counts.failure.unimproved")

    a-tab-pane(key="5" :tab="tab_improved")
      a-spin(:spinning="spinning")
        user-shops(:shops="user.failure.improved" type="improved" :counts="user.counts.failure.improved")

    a-tab-pane(key="3" :tab="tab_success")
      a-spin(:spinning="spinning")
        user-shops(:shops="user.success" type="success" :counts="user.counts.success")

</template>

<script>
import User from '../../api/user'
import { message } from 'ant-design-vue'
import UserActivities from './UserActivities'
import UserShops from './UserShops'

export default {
  components: {
    UserActivities,
    UserShops
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
      spinning: false,
      activeKey: '1',
      activities: {
        counts: {
          activities: {
            count_a: 0,
            count_shop: 0
          }
        }
      },
      activities_offset: 0
    }
  },
  created() {
    // watch the params of the route to fetch the data again
    this.$watch(
      () => this.$route.params,
      () => {
        this.fetch_user_single()
        this.activities_offset = parseInt(this.$route.params.date) - 1
        this.fetch_user_single_acts(parseInt(this.$route.params.date) - 1)
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
      let t = this.activities.counts.activities
      return `动态 ${t.count_a}/${t.count_shop}`
    },
    tab_responsibles() {
      let t = this.user.counts.responsibles
      return `负责 ${t.count_a}/${t.count_q}/${t.count_shop}/${t.count_shop_a}`
    },
    tab_success() {
      let t = this.user.counts.success
      return `success ${t.count_shop}`
    },
    tab_unimproved() {
      let t = this.user.counts.failure.unimproved
      return `未优化 ${t.count_q}/${t.count_shop}`
    },
    tab_improved() {
      let t = this.user.counts.failure.improved
      return `全优化 ${t.count_a}/${t.count_shop}`
    },
    tab_improving() {
      let t = this.user.counts.failure.improving
      return `优化中 ${t.count_a}/${t.count_q}/${t.count_shop}/${t.count_shop_a}`
    }
  },
  methods: {
    fetch_user_single() {
      this.spinning = true
      new User(this.username, this.date)
        .single()
        .then(res => {
          this.user = res
          this.spinning = false
        })
        .catch(e => {
          message.error(e)
          this.spinning = false
        })
    },
    fetch_user_single_acts(d) {
      this.spinning = true
      new User(this.username, d)
        .single_acts()
        .then(res => {
          this.activities = res
          this.spinning = false
        })
        .catch(e => {
          message.error(e)
          this.spinning = false
        })
    },
    tab_click(key) {
      if (this.activeKey == key) {
        this.fetch_user_single()
        this.activities_offset = parseInt(this.date) - 1
        this.fetch_user_single_acts(this.activities_offset)
      }
    },
    fetch_more_acts() {
      this.activities_offset += 1
      this.fetch_user_single_acts(this.activities_offset)
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
