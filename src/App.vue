<template>
  <section class="section has-text-centered">
    <img src="./assets/logo.png">
    <h1 class="subtitle">{{ msg }}</h1>
    <h2 >Essential Links</h2>
    <span class="tag is-white"><a href="https://vuejs.org" target="_blank">Core Docs</a></span>
    <span class="tag is-white"><a href="https://forum.vuejs.org" target="_blank">Forum</a></span>
    <span class="tag is-white"><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></span>
    <span class="tag is-white"><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></span>
    <h2 >Ecosystem</h2>
    <span class="tag is-white"><a href="http://router.vuejs.org/" target="_blank">vue-router</a></span>
    <span class="tag is-white"><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></span>
    <span class="tag is-white"><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></span>
    <span class="tag is-white"><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></span>
  </section>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
