<template lang="pug">
div.tools-food-mt
  a(href="/美团折扣商品涨原价表格模板.xlsx" target="_blank") 下载模板
  a-upload(v-model:file-list="fileList" action="http://192.168.3.3:9005/upload")
    a-button(size="small")
      UploadOutlined
      span 上传表格
  a-button(@click="run") 运行
  p {{fileList}}
  a-divider
  p(style="white-space: pre-wrap;") {{results.join('\n')}}
</template>

<script>
import { UploadOutlined } from '@ant-design/icons-vue'
import SockJS from 'sockjs-client'
import { message } from 'ant-design-vue'

export default {
  name: 'tools-food-mt',
  components: {
    UploadOutlined
  },
  data() {
    return {
      fileList: [],
      sock: new SockJS('http://192.168.3.3:9998/price_update'),
      results: []
    }
  },
  methods: {
    run() {
      let file = this.fileList.find(v => v.status == 'done')
      if (!file) {
        message.error('please upload a file')
        return
      }
      this.sock.send(file.response.res.filename)
      this.sock.onmessage = e => {
        console.log('message', e.data)
        this.results.push(e.data)
        window.scrollTo(0,document.body.scrollHeight + 20)
      }
    }
  },
  created() {
    this.sock.onopen = function() {
      console.log('open')
    }

    this.sock.onclose = function() {
      console.log('close')
    }
  }
}
</script>

<style lang="sass" scoped>
.tools-food-mt
  width: 960px
  margin: 20px auto
</style>
