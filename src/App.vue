<template>
  <div id="app">
    <faker></faker>
    <app-usage></app-usage>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Faker from './Faker.vue'
import AppUsage from './AppUsage.vue'
import AppFooter from './AppFooter.vue'

export default {
  name: 'home',
  components: {
    Faker, AppUsage, AppFooter
  }
}
</script>
