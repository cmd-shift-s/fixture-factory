# Fixture Factory

> Generate massive amounts of fixtures based on predefined model using [faker.js](https://github.com/marak/Faker.js) methods.

Open https://gongzza.github.io/fixture-factory

# Usage

1. Type을 선택하세요.
1. Query을 입력하세요.(Type에 따라서 입력하는 형식이 달라집니다.)
1. Query에 포커싱 된 상태로 Enter를 누르거나 Generate버튼을 클릭합니다.
1. Result를 복사합니다.

## Type

선택에 따라서 Query 입력 형식이 달라집니다.

#### Number Random
숫자를 랜덤하게 표시합니다.

- Query: number[, number]
- number를 하나만 입력할 경우 숫자 범위가 양수는 0부터, 음수는 -1부터 입니다.

#### Number

숫자를 순차적으로 표시합니다.

- Query: number[, number]
- number를 하나만 입력할 경우 음수와 양수 모두 0부터 시작합니다.

#### String

입력한 포멧에 맞춰서 표현해 줍니다. 자세한 사항은 다음 Query Tab에서 확인해 주세요.

### Query

Type이 String일 경우의 설명입니다.

기본적으로 [faker.fake](https://github.com/marak/Faker.js/#fakerfake)함수를 기반으로 동작합니다.

Example:

- Query: {{lorem.word}}
- Result: ipsum

거기에 몇가지 동작을 추가해 보았습니다.

**{{fake}}:number**

계속 랜덤이 아닌 위에서 지정한 개수만큼 랜덤을 만들고 그 리스트로 다시 랜덤을 돌리는 방식입니다.

Example:
- Query: {{lorem.word}}:1
- Count: 3
- Result: ipsum, ipsum, ipsum

Example:
- Query: {{lorem.word}}.{{system.commonFileExt}}:3
- Count: 10
- Result: aperiam.jpeg, natus.png, sunt.png, qui.png, aut.gif, quae.gif, in.gif, ut.gif, et.png, dolorum.gif

### Others

Count와 Delimiter는 표시되면 필수로 입력해야 합니다.

- Count: 아이템 개수
- Delimiter: 아이템 구분 문자

## Contributor

언제나 환영입니다.
