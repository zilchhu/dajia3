<template lang="pug">
a-card(:title="card_title" :bordered="false" size="small")
  qa-form(:items="qa_items")
</template>

<script>
import QAForm from './QAForm'

export default {
  name: 'shop-card',
  components: {
    QAForm
  },
  props: {
    shop: Object
  },
  computed: {
    card_title() {
      return `${this.shop.shop_name}  ${this.shop.platform}`
    },
    qa_items() {
      if (this.shop.a.length == 0)
        return {
          items_filled: [],
          items_unfilled: this.shop.q.map(x => ({
            q: x.type,
            name: this.shop.person,
            a: '',
            time: '',
            operation: 'save'
          }))
        }

      let items_filled = this.shop.a.filter(a => a.a.trim().length > 0)
      let items_unfilled = this.shop.a.filter(a => a.a.trim().length == 0)

      return {
        items_filled,
        items_unfilled
      }
    }
  }
}
</script>
