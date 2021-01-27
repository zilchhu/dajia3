<template lang="pug">
.tests
  .header
    span.title tests:sync/del
  .form
    a-input(v-model:value="wmPoiId" placeholder="wmPoiId" size="small" style="width: 160px; flex: 1 1 auto;")
    a-button(@click="sync" :loading="loading_sync" size="small" :disabled="false") 同步
    a-button(@click="del" :loading="loading_del" size="small") 删除
  .txt {{res_sync}}
  .txt {{res_del}}
</template>

<script>
import Tests from '../../api/tests'

export default {
  name: 'tools-tests',
  data() {
    return {
      wmPoiId: '',
      res_sync: '',
      res_del: '',
      loading_sync: false,
      loading_del: false
    }
  },
  methods: {
    sync() {
      this.loading_sync = true
      new Tests(this.wmPoiId)
        .sync()
        .then(res => {
          this.res_sync = res
          this.loading_sync = false
        })
        .catch(err => {
          this.res_sync = err
          this.loading_sync = false
        })
    },
    del() {
      this.loading_del = true
      new Tests(this.wmPoiId)
        .del()
        .then(res => {
          this.res_del = res
          this.loading_del = false
        })
        .catch(err => {
          this.res_del = err
          this.loading_del = false
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.tests
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
  justify-content: space-around
  align-items: center

.form > *
  margin-right: 30px

.txt
  margin-top: 20px
</style>
