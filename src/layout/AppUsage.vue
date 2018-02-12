<template lang="html">
  <section class="section">
    <div class="container">
      <div class="content" v-html="readme">
      </div>
    </div>
  </section>
</template>

<script>
const md = require('markdown-it')()

export default {
  name: 'app-usage',
  computed: {
    readme() {
      return md.render(`
## Usage

1. Query을 입력하세요.
1. Query에 포커싱 된 상태로 Enter를 누르거나 Generate버튼을 클릭합니다.
1. Result를 복사합니다.

## Query

기본적으로 [faker.fake](https://github.com/marak/Faker.js/#fakerfake)함수를 기반으로 동작합니다.

Example:

- Query: {{lorem.word}}
- Result: ipsum

### Extensions

**{{num.range(start, count, inc)}}**

start 값부터 시작해서 count 만큼 inc 씩 증가시킨 리스트를 리턴합니다.

start만 입력할 경우 1부터 시작합니다.

inc 기본 값은 1 입니다.

Example:

- Query: {{num.range(10)}}
- Count: 1
- Result: 1,2,3,4,5,6,7,8,9,10

Example:

- Query: {{num.range(-10, 10)}}
- Count: 1
- Result: -10,-9,-8,-7,-6,-5,-4,-3,-2,-1

Example:

- Query: {{num.range(-10, 10, 2)}}
- Count: 1
- Result: -10,-8,-6,-4,-2,0,2,4,6,8

**{{num.random(min, max)}}**

min부터 max사이의 랜덤한 숫자를 리턴합니다.

min만 입력할 경우 0부터 시작합니다.

Example:

- Query: {{num.random(10)}}
- Count: 3
- Result: 10, 0, 1

Example:

- Query: {{num.random(-10, 10)}}
- Count: 3
- Result: -10, 0, 10

### Plugins

fake query에 plugin을 붙일 수 있습니다.

**{{fake|pick(number)}}**

계속 랜덤이 아닌 위에서 지정한 개수만큼 랜덤을 만들고 그 리스트로 다시 랜덤을 돌리는 방식입니다.

Example:
- Query: {{lorem.word|pick(1)}}
- Count: 3
- Result: ipsum, ipsum, ipsum

Example:
- Query: {{lorem.word}}.{{system.commonFileExt|pick(3)}}
- Count: 10
- Result: aperiam.jpeg, natus.png, sunt.png, qui.png, aut.gif, quae.gif, in.gif, ut.gif, et.png, dolorum.gif

**{{fake|date(format)}}**

날짜를 형식에 맞춰서 출력하는 기능입니다.

Example:
- Query: {{date.past|date(YYYY-MM-DD a hh:mm:ss Z)}}
- Result: 2017-11-05 am 01:48:26 +09:00, 2017-09-14 pm 10:45:40 +09:00, 2018-01-29 am 06:48:18 +09:00

**{{fake|string methods}}**

String 메소드들을 사용할 수 있습니다.

메소드 목록은 [여기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String)를 참고하시기 바랍니다.

Example:
- Query: {{lorem.word|pick(1)|concat(!!)}}
- Result: ipsum!!, ipsum!!, ipsum!!

Example:
- Query: {{lorem.word|padStart(10, 0)}}
- Result: temporibus, 00000animi, 00delectus

Example
- Query: {{lorem.words|replace(/\s/g, '')}}
- Result: doloremporroqui, consecteturdolorratione, sitcorruptirerum

### Others

Count와 Delimiter는 표시되면 필수로 입력해야 합니다.

- Count: 아이템 개수
- Delimiter: 아이템 구분 문자

## Contributor

언제나 환영입니다.
`)
    }
  }
}
</script>
