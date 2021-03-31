<template lang="pug">
div.table-select
  a-input-search(v-model:value="searchText" placeholder="筛选（支持正则表达式）" @search="onSearch" @change="onChange")

  a-checkbox(v-model:checked="allChecked" @change="onCheckAll" :indeterminate="indeterminate") 全选
  a-checkbox-group.scroll(:options="checkOptions" v-model:value="checkedList")
  a-button.mr10(size="small" @click="onClick") 确定
  a-button(size="small" @click="onResetClick") 重置
  //- p {{checkedList}}
</template>

<script>
import md5 from 'md5'

export default {
  name: 'table-select',
  props: ['filterOptions', 'selectedList'],
  data() {
    return {
      searchText: '',
      checkedList: [],
      checkOptions: [],
      indeterminate: true,
      allChecked: false
    }
  },
  computed: {
    filterOptionMd5() {
      return md5(this.filterOptions)
    }
  },
  methods: {
    onChange() {
      let reg = new RegExp(this.searchText)
      this.checkOptions = this.filterOptions.filter(v => reg.test(v.label))
      this.checkedList = this.checkOptions.map(v => v.value)
    },
    onSearch() {
      this.onClick()
    },
    onCheckAll(e) {
      this.checkedList = e.target.checked ? this.checkOptions.map(v => v.value) : []
      this.indeterminate = false
    },
    onClick() {
      this.$emit('confirm', this.checkedList)
    },
    onResetClick() {
      this.checkedList = []
      this.$emit('reset')
    }
  },
  watch: {
    filterOptionMd5(n) {
      console.log('filterOptions Changed', n)
      this.checkOptions = this.filterOptions
    },
    selectedList(n) {
      this.checkedList = n
    },
    checkedList(n) {
      this.indeterminate = !!n.length && n.length < this.checkOptions.length
      this.allChecked = n.length == this.checkOptions.length
      this.$emit('select-change', n)
    }
  }
}
</script>

<style lang="sass">
.table-select .ant-checkbox-wrapper, .table-select .ant-checkbox-group
  display: block

.scroll
  max-height: 250px
  overflow: scroll

.mr10
  margin-right: 10px
</style>
