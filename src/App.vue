<template>
  <div id="app">
    <faker></faker>
    <app-usage></app-usage>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Faker from './components/Faker.vue'
import AppUsage from './layout/AppUsage.vue'
import AppFooter from './layout/AppFooter.vue'

export default {
  name: 'home',
  components: {
    Faker, AppUsage, AppFooter
  }
}
</script>
