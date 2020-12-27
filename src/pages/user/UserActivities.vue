<template lang="pug">
a-list(:dataSource="activities" :bordered="false")
  template(#renderItem="{item, index}")
    activity-card(:activity="{...item, index}")
</template>

<script>
import ActivityCard from '../../components/user/ActivityCard'
export default {
  name: 'user-activities',
  components: {
    ActivityCard
  },
  props: {
    activities: Array
  }
}
</script>

