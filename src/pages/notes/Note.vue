<template lang="pug">
div.note
  main.note-main
    .editor
      a-textarea(v-model:value="editorText" :auto-size="{ minRows: 3}")
      .editor-buttons
        div
          a-auto-complete(v-model:value="user" style="width: 80px;")
            template(#dataSource)
              a-select-option(v-for="user in users" :key="user") {{user}}
        a-button(type="primary" @click="pub") 发布
    a-spin(:spinning="loading")
      a-list.note-list(:data-source="noteList" item-layout="vertical" :split="false")
        template(#renderItem="{ item }")
          a-list-item(:key="item.key")
            a-list-item-meta
              template(#title)
                .note-item-title 
                  span {{item.title}}
                  a-dropdown
                    DownOutlined
                    template(#overlay)
                      a-menu
                        a-menu-item(@click="e => del(item)") 删除
              template(#description)
                .note-item-description {{moment(item.updated_at).fromNow()}} 
            div(contentEditable="true") {{item.content}}
</template>

<script>
import { message } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import Notes from '../../api/notes'
import Shop from '../../api/shop'

export default {
  name: 'Note',
  components: {
    DownOutlined
  },
  data() {
    return {
      user: '匿名',
      editorText: '',
      noteList: [
        {
          key: '1',
          title: 'title',
          description: 'description',
          content: 'content'
        },
        {
          key: '2',
          title: 'title',
          description: 'description',
          content: 'content'
        }
      ],
      realShops: [],
      loading: false,
      moment
    }
  },
  computed: {
    realShopPersons() {
      return Array.from(new Set(this.realShops.map(v => v.person).filter(v => v)))
    },
    realShopNewPersons() {
      return Array.from(new Set(this.realShops.map(v => v.new_person).filter(v => v)))
    },
    users() {
      return ['匿名', ...this.realShopPersons, ...this.realShopNewPersons]
    }
  },
  methods: {
    pub() {
      if (this.editorText.trim() == '' || this.user.trim() == '') return
      this.loading = true
      let key = uuidv4()
      let description = ''
      new Notes()
        .save(key, this.user, description, this.editorText)
        .then(res => {
          this.noteList = [
            {
              key,
              title: this.user,
              description,
              content: this.editorText
            },
            ...this.noteList
          ]
          this.editorText = ''
          message.success(res)
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    },
    del(item) {
      console.log(item)
      new Notes()
        .delete(item.key)
        .then(res => {
          this.noteList.splice(
            this.noteList.findIndex(v => v.key == item.key),
            1
          )
          message.success(res)
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    },
    fetchNotes() {
      this.loading = true
      new Notes()
        .base()
        .then(res => {
          this.noteList = res
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    },
    fetchRealShops() {
      this.loading = false
      new Shop()
        .real()
        .then(res => {
          this.realShops = res
          this.loading = false
        })
        .catch(err => {
          message.error(err)
          this.loading = false
        })
    }
  },
  created() {
    this.fetchNotes()
    this.fetchRealShops()
  }
}
</script>

<style lang="sass" scoped>
.note
  display: flex
  flex-direction: column
  align-items: center
  width: 100%
  min-height: 100vh
  background: no-repeat url("https://img.t.sinajs.cn/t6/skin/skin048/images/body_bg.jpg?id=201503261330")
  background-attachment: fixed
  background-size: cover

.note-main
  max-width: 960px
  width: 100%

.editor
  margin: 20px 0

.editor-buttons
  margin-top: 6px
  display: flex
  justify-content: space-between

.note-item-actions
  display: flex

.note-item-title
  display: flex
  justify-content: space-between
  font-size: 0.7em

.note-item-title > span
  font-size: 0.886em
  font-weight: bold

.note-item-description
  font-size: 12px
</style>
