<template lang="html">
  <section class="section">
    <div class="container">
      <form @submit.prevent="generate()">
        <div class="field has-addons has-addons-centered">
          <div class="field">
            <label class="label">Type</label>
            <div class="control">
              <div class="select">
                <select v-model="type">
                  <option value="num_random">Number Random</option>
                  <option value="number">Number</option>
                  <option value="fake">Fake</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field" v-if="isNumRandom || isFake">
            <label class="label">Count</label>
            <div class="control">
              <input type="number" class="input" v-model="count" required>
            </div>
          </div>
          <div class="field" v-if="isNumRandom || isFake">
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
            <input class="input" id="query" v-model="query">
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
    type: 'fake',
    result: '',
    delimiter: ', '
  }),
  computed: {
    isNumRandom() { return this.type === 'num_random' },
    isNumber() { return this.type === 'number' },
    isFake() { return this.type === 'fake' }
  },
  methods: {
    generate() {
      if (this.query.trim().length == 0) {
        this.$el.querySelector('#query').focus()
        return
      }

      if (this.isFake) {
        this.result = faker.fake(this.query, this.count).join(this.delimiter)
      } else {
        let [min, max, inc = 1] = this.query.split(',').map(s => parseInt(s, 10))
        if (typeof max === 'undefined') {
          max = min
          min = 0
        }

        if (this.isNumRandom) {
          this.result = faker.randomNumber(min, max, this.count).join(this.delimiter)
        } else {
          this.result = faker.range(min, max, inc).join(this.delimiter)
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
