<template lang="pug">
.add-fengniao
  .header
    span.title add-fengniao
  .form
    a-form(:model="formState" :label-col="{span: 2, offset: 4}" labelAlign="left" :wrapper-col="{span: 14}")

      a-form-item(label="shopId")
        a-input(v-model:value="formState.shopId" placeholder="请输入shopId")

      a-form-item(label="门店名")
        a-input(v-model:value="formState.shopName" placeholder="请输入门店名")

      a-form-item(label="账号")
        a-input(v-model:value="formState.loginName" placeholder="请输入账号")

      a-form-item(label="密码")
        a-input(v-model:value="formState.password" placeholder="请输入密码")
      
      a-form-item(:wrapper-col="{ span: 14, offset: 6 }")
        a-button(type="primary" :loading="loading" @click="onSubmit") 保存

    p {{res}}

</template>

<script>
import Shop from '../../api/shop'
import { message } from 'ant-design-vue'

export default {
  name: 'tools-add-fengniao',
  data() {
    return {
      formState: {
        shopId: '',
        shopName: '',
        loginName: '',
        password: ''
      },
      loading: false,
      res: ''
    }
  },
  methods: {
    onSubmit() {
      console.log(this.formState)
      this.loading = true
      new Shop()
        .addFengniao(this.formState)
        .then(res => {
          this.res = res
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
.add-fengniao
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
