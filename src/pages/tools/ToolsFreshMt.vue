<template lang="pug">
.fresh-mt
  .header
    span.title new-shop-setting:mt
  .form
    a-input(v-model:value="wmPoiId" placeholder="poi_id" size="small" style="width: 160px; flex: 1 1 auto;")

    a-radio-group(name="poi_type" v-model:value="poi_type" size="small")
      a-radio(value="甜品") 甜品
      a-radio(value="贡茶") 贡茶
    a-radio-group(name="poi_plan_type" v-model:value="poi_plan_type" size="small")
      a-radio(:value="1") 正常
      a-radio(:value="2") 择优
      a-radio(:value="3") 扣点
      a-radio(:value="4") 择优扣点
      a-radio(:value="5") 仅限
    a-button(@click="run" :loading="loading" size="small") run
  a-list(:dataSource="tasks" :split="false" :loading="loading" :grid="{ gutter: 6, column: 2 }")
    template(#renderItem="{item, index}")
      a-list-item(:key="item.key")
        a-list-item-meta
          template(#title)
            a-checkbox(v-model:checked="item.checked") {{item.name}}
          template(#description)
            .txt {{item.res}}
</template>

<script>
import Fresh from '../../api/fresh'
import { message } from 'ant-design-vue'

export default {
  name: 'tools-fresh-mt',
  data() {
    return {
      wmPoiId: '10085676',
      poi_type: '甜品',
      poi_plan_type: 1,
      tasks: [
        { key: 1, name: '下单返券', checked: true, res: null },
        { key: 2, name: '店内领券', checked: true, res: null },
        { key: 3, name: '收藏有礼', checked: true, res: null },
        { key: 4, name: '代金券包', checked: true, res: null },
        { key: 5, name: '集点返券', checked: true, res: null },
        { key: 6, name: '满减活动', checked: true, res: null },
        { key: 7, name: '超值换购', checked: true, res: null },

        { key: 8, name: '老板推荐', checked: true, res: null },
        { key: 9, name: '减配送费', checked: true, res: null },
        { key: 10, name: '到店自取', checked: true, res: null },
        { key: 11, name: '极速退款', checked: true, res: null },
        { key: 12, name: '青山公益', checked: true, res: null },
        { key: 13, name: '营业设置', checked: true, res: null },
        { key: 14, name: '开具发票', checked: true, res: null },
        { key: 15, name: '门店公告', checked: true, res: null },
      ],
      loading: false
    }
  },
  methods: {
    run() {
      this.loading = true
      let userTasks = this.tasks.filter(v => v.checked).map(v => ({ name: v.name }))
      let userRule = { wmPoiId: this.wmPoiId, wmPoiType: this.poi_type }
      new Fresh(userTasks, userRule)
        .mt()
        .then(result => {
          this.tasks = this.tasks.map(v => {
            let res = result.find(k => k.name == v.name)
            if (res) {
              return {
                ...v,
                checked: res.status == 'fail',
                res: res.status == 'succ' ? res.value : res.reason
              }
            }
            return v
          })
          console.log(this.tasks)
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.fresh-mt
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

.form
  display: flex
  height: 60px
  margin-bottom: 20px
  justify-content: space-around
  align-items: center

.form > *
  margin-right: 30px
</style>
