<template lang="pug">
div
  a-menu(v-model:selectedKeys="menu_keys" theme="light" mode="horizontal")
    a-menu-item(key="date:1")
      router-link(:to="{ name: 'index'}") overview
    a-sub-menu
      template(#title)
        span users
      a-menu-item(v-for="name in all_names" :key="name")
        router-link(:to="{ name: 'user', params: { username: name, date: $route.params.date || 0 }}") {{name}}
    //- a-menu-item(key="tools")
      //- router-link(:to="{ name: 'tools'}") tools
  router-view(v-slot="{ Component }")
    transition
      keep-alive
        component(:is="Component")
</template>

<script>
import User from './api/user'
export default {
  data() {
    return {
      menu_keys: [],
      all_names: []
    }
  },
  methods: {
    fetch_all_names() {
      new User('')
        .all_names()
        .then(res => {
          this.all_names = res
        })
        .catch(err => console.error(err))
    }
  },
  mounted() {
    this.fetch_all_names()
  }
}
</script>
