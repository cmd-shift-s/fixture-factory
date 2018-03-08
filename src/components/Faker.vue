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
              <input type="text" class="input" v-model="delimiter">
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

// new line 검증 정규화 표현식
const regNewLine = /(\\r\\n|\\n|<br\/?>)/g

export default {
  name: 'faker',
  data: () => ({
    query: '',
    count: 3,
    result: '',
    delimiter: ', ' // 구분자
  }),
  mounted() {
    this.$refs.query.focus()
  },
  computed: {
    /**
     * 구분자에 개행문자가 포함 되어 있을 경우
     * textarea에서 개행되어 표시되도록 수정해서 리턴한다.
     */
    replacedDelimiter() {
      return regNewLine.test(this.delimiter)
        ? this.delimiter.replace(regNewLine, '\n')
        : this.delimiter
    }
  },
  methods: {
    generate() {
      if (this.query.trim().length == 0) {
        this.$refs.query.focus()
        return
      }

      try {
        this.result = faker.fake(this.query, this.count).join(this.replacedDelimiter)
        gtag('event', 'generate', {'event_category': 'generate_success', 'event_label': this.query, 'value': 1})
      } catch(e) {
        this.result = e.message || e
        gtag('event', this.query, {'event_category': 'generate_error', 'event_label': this.result})
      }
    }
  }
}
</script>
