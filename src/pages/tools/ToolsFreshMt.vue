<template lang="pug">
.fresh-mt
  .header
    span.title new-shop-setting:mt
  .form
    a-input(v-model:value="wmPoiId" placeholder="poi_id" size="small" style="width: 160px; flex: 1 1 auto;")
    a-input(v-model:value="poi_phone" placeholder="poi_phone" size="small" style="width: 160px; flex: 1 1 auto;")
    a-radio-group(name="poi_type" v-model:value="poi_type" size="small")
      a-radio(:value="1") 甜品
      a-radio(:value="2") 贡茶
    a-radio-group(name="poi_plan_type" v-model:value="poi_plan_type" size="small")
      a-radio(:value="1") 正常
      a-radio(:value="2") 择优
      a-radio(:value="3") 扣点
      a-radio(:value="4") 择优扣点
      a-radio(:value="5") 仅限
    a-button(@click="run" size="small") run
  a-list(:dataSource="tasks" :split="false")
    template(#renderItem="{item, index}")
      a-list-item(:key="item.key")
        a-list-item-meta
          template(#title)
            a-checkbox(v-model:checked="item.checked") {{item.task}}
          template(#description)
            .txt -
</template>

<script>
export default {
  name: 'tools-fresh-mt',
  data() {
    return {
      wmPoiId: '9470231',
      poi_phone: '15814227912',
      poi_type: 1,
      poi_plan_type: 1,
      tasks: [
        { key: 1, task: '集点返券', checked: true },
        { key: 2, task: '代金券包', checked: true },
        { key: 3, task: '收藏有礼', checked: true }
      ]
    }
  },
  methods: {
    run() {}
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
