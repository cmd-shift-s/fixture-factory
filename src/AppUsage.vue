<template lang="html">
  <section class="section">
    <div class="container">
      <div class="content">
        <h1> Usage </h1>
        <ol>
          <li><b>Type</b>을 선택하세요.</li>
          <li><b>Query</b>을 입력하세요.(<b>Type</b>에 따라서 입력하는 형식이 달라집니다.)</li>
          <li><b>Query</b>에 포커싱 된 상태로 Enter를 누르거나 <b>Generate</b>버튼을 클릭합니다.</li>
          <li><b>Result</b>를 복사합니다.</li>
        </ol>
        <h2> Type </h2>
        <p>선택에 따라서 Query 입력 형식이 달라집니다.</p>
        <h4>Number Random</h4>
        <p>숫자를 랜덤하게 표시합니다.</p>
        <ul>
          <li>Query: number[, number]</li>
          <li>number를 하나만 입력할 경우 숫자 범위가 양수는 0부터, 음수는 -1부터 입니다.</li>
        </ul>
        <h4>Number</h4>
        <p>숫자를 순차적으로 표시합니다.</p>
        <ul>
          <li>Query: number[, number]</li>
          <li>number를 하나만 입력할 경우 음수와 양수 모두 0부터 시작합니다.</li>
        </ul>
        <h4>Fake</h4>
        <p>입력한 포멧에 맞춰서 표현해 줍니다. 자세한 사항은 다음 Query Tab에서 확인해 주세요.</p>

        <h2>Query</h2>
        <p>Type이 Fake일 경우의 설명입니다.</p>
        <p>기본적으로 <a target="_blank" href="https://github.com/marak/Faker.js/#fakerfake">faker.fake</a>함수를 기반으로 동작합니다.</p>
        <p>Example:</p>
        <ul>
          <li v-text="`Query: {{lorem.word}}`"></li>
          <li>Result: ipsum</li>
        </ul>
        <p>거기에 몇가지 동작을 추가해 보았습니다.</p>
        <h5><b v-text="`{{fake}}:number`"></b></h5>
        <p>계속 랜덤이 아닌 위에서 지정한 개수만큼 랜덤을 만들고 그 리스트로 다시 랜덤을 돌리는 방식입니다.</p>
        <p>Example:</p>
        <ul>
          <li v-text="`Query: {{lorem.word}}:1`"></li>
          <li>Count: 3</li>
          <li>Result: ipsum, ipsum, ipsum</li>
        </ul>
        <p>Example:</p>
        <ul>
          <li v-text="`Query: {{lorem.word}}.{{system.commonFileExt}}:3`"></li>
          <li>Count: 10</li>
          <li>Result: aperiam.jpeg, natus.png, sunt.png, qui.png, aut.gif, quae.gif, in.gif, ut.gif, et.png, dolorum.gif</li>
        </ul>
        <h2>Others</h2>
        Count와 Delimiter는 표시되면 필수로 입력해야 합니다.
        <ul>
          <li>Count: 아이템 개수</li>
          <li>Delimiter: 아이템 구분 문자</li>
        </ul>
        <h1>Contributor</h1>
        <p>언제나 환영입니다.</p>
      </div>
    </div>
  </section>
</template>
