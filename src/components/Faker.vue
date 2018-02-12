<template lang="html">
  <section class="section">
    <div class="container">
      <form @submit.prevent="generate()">
        <div class="field has-addons has-addons-centered">
          <div class="field">
            <label class="label">Count</label>
            <div class="control">
              <input type="number" class="input" v-model="count" required>
            </div>
          </div>
          <div class="field">
            <label class="label">Delimiter</label>
            <div class="control">
              <input type="text" class="input" v-model="delimiter" required>
            </div>
          </div>
          <div class="field">
            <label class="label">&nbsp;</label>
            <div class="control">
              <button class="button is-success" type="submit">Generate</button>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">Query</label>
          <div class="control">
            <input class="input" id="query" ref="query" v-model="query" required>
          </div>
        </div>
        <div class="field">
          <label class="label">Result</label>
          <div class="control">
            <textarea class="textarea">{{result}}</textarea>
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import * as faker from '@/lib/faker'

export default {
  name: 'faker',
  data: () => ({
    query: '',
    count: 3,
    result: '',
    delimiter: ', '
  }),
  mounted() {
    this.$refs.query.focus()
  },
  methods: {
    generate() {
      if (this.query.trim().length == 0) {
        this.$refs.query.focus()
        return
      }

      try {
        this.result = faker.fake(this.query, this.count).join(this.delimiter)
      } catch(e) {
        this.result = e.message || e
      }
    }
  }
}
</script>
