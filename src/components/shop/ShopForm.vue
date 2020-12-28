<template lang="pug">
a-card(size="small")
  template(#title)
    .title
      .title-meta
        span.title_shopname {{shop_meta.shop_name}}
        span.title_platform {{shop_meta.platform}}
      .title-tags
        a-tooltip(v-for="tag in tags" :key="tag.q")
          template(#title)
            span {{tag.value}}
          a-checkable-tag(:style="{background: tag.tag_color}" v-model:checked="tag.checked") {{tag.q}}
  a-table(v-if="items_show.length > 0" :columns="columns" :data-source="items_show" rowKey="q" :pagination="false" size="small" :showHeader="false")
    template(#name="{text, record}")
      a-input(:value="text" @change="e => handleChange(e.target.value, record.q, 'name')" size="small")
    template(#a="{text, record}")
      a-textarea(:value="text" @change="e => handleChange(e.target.value, record.q, 'a')" :autoSize="{minRows: 1}" style="padding: 1px 7px;")
    template(#operation="{text, record}")
      a-button(@click="e => save(record)" size="small") {{text}}
</template>

<script>
import dayjs from 'dayjs'
import {message} from 'ant-design-vue'
import {updateTableById} from '../../api'

function omit(obj, ks) {
  let newKs = Object.keys(obj).filter(v => !ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

export default {
  name: 'shop-form',
  props: {
    // id: Number,
    as: Array,
    shop_meta: Object
  },
  data() {
    const columns = [
      {
        title: '问题',
        dataIndex: 'q',
        width: 100
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
        slots: { customRender: 'name' }
      },
      {
        title: '优化',
        dataIndex: 'a',
        width: 440,
        slots: { customRender: 'a' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        slots: { customRender: 'operation' },
        width: 120
      },
      {
        title: '时间',
        dataIndex: 'time',
        width: 180
      }
    ]
    return {
      columns,
      tags: this.as
        .map(a => ({ ...a, checked: false, saved: a.a.trim().length > 0 }))
        .map(a => ({ ...a, tag_color: a.saved ? '#91d5ff99' : '#fefefe' }))
    }
  },
  computed: {
    items_show() {
      return this.tags.filter(v => v.checked)
    },
    card_title() {
      return `${this.shop_meta.shop_name}  ${this.shop_meta.platform}`
    }
  },
  methods: {
    handleChange(value, key, column) {
      const newTags = [...this.tags]
      const target = newTags.filter(item => key === item.q)[0]
      if (target) {
        target[column] = value
        this.tags = newTags
      }
    },
    save(record) {
      const newItems = [...this.tags]
      const target = newItems.filter(item => record.q === item.q)[0]
      if (target) {
        target['time'] = dayjs().format('YYYY/MM/DD HH:mm:ss')
        let a = JSON.stringify(newItems.map(v => omit(v, ['checked', 'time_parsed', 'saved', 'tag_color', 'value', 'threshold'])))
        updateTableById(this.shop_meta.id, a)
          .then(res => {
            message.success(res)
            this.tags = newItems
          })
          .catch(err => {
            message.error(err)
          })
        console.log(a)
      }
    }
  }
}
</script>

<style lang="sass">
.title
  display: flex
  align-items: center
  justify-content: space-between

.title_shopname, .title_platform
  font-size: 13px
  color: rgba(0, 0, 0, 0.65)
  margin-right: 20px

.title_platform
  font-size: 12px

.ant-tag-checkable-checked
  color: #f5222d
  background: #fff1f0
  border-color: #ffa39e

.ant-tag-checkable:hover
  color: #f5222d

.ant-card-body
  padding: 0 !important

.ant-card-bordered
  border-color: #91d5ff40

.ant-table-tbody > tr > td
  border: none
</style>
