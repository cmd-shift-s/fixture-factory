import faker from 'faker'
import * as plugins from './plugins'
import * as utils from './utils'

// install extensions
require('./extensions')(faker)

/**
 * Query를 파싱해서 cnt 개수 만큼의 결과를 배열로 리턴한다.
 *
 * @param {string} query - Fake query
 * @param {number} count - Array length
 * @return {Array}
 */
 export function fake(query, count) {

   // @exception Invalid plugin
   const result = parseQuery(query)

   // @exception Invalid module or method
   const fn = () => result.map(q => typeof q === 'function'?q():q).join('')

   return Array.from({length: count}, fn)
 }

 // fake 결과들을 저장하고 참조하기 위해서 사용
 const fakeResults = []

 // fakeResults에서 결과를 리턴한다.
 function getFakeResults(idx) {
   if (idx > fakeResults.length || idx <= 0) return ''
   return fakeResults[idx - 1]
 }

 /**
  * 결과를 fakeResults에 저장하고 리턴하는 함수를 만든다.
  *
  * @param {boolean} isHide - true일 경우 빈 문자열을 리턴한다.
  */
 function saveFakeResult(fn, isHide) {
   return () => {
     const result = fn()
     fakeResults.push(result)
     return isHide ? '' : result
   }
 }

/**
 * query에서 fake query를 찾아서
 * 일반 문자열과 분리한 결과를 배열로 리턴한다.
 *
 * @exception InvalidPlugin
 * @param {string} query
 * @return {Array}
 */
function parseQuery(query) {

  let start = query.search('{{')
  let end = query.search('}}')

  if (!~start || !~end) {
    return [query]
  }

  // Query 파싱 결과를 저장
  const result = [
    () => {
      // fakeResults 초기화
      fakeResults.length = 0
      return ''
    }
  ]

  if (start !== 0) {
    // {{ 로 시작하지 않을 경우
    // 앞 문자열을 저장
    result.push(query.substr(0, start))
  }

  while(~end) {
    // {{ }} 는 제거된 fake query만 보냄
    result.push(parseFake(query.substring(start + 2, end).trim()))

    // }} 까지 계산하기 위해서
    end += 2

    start = query.indexOf('{{', end)
    if (start !== -1 && start !== end) {
      // 다음 fake 사이의 문자열 저장
      result.push(query.substring(end, start))
    } else if (start === -1 && end < query.length) {
      // 더 이상 시작 값이 없을 경우 남은 문자열 저장
      result.push(query.substring(end))
      break;
    }

    end = query.indexOf('}}', end)
  }

  // 시작 값이 있는데 종료 된 경우 남은 문자열 저장
  if (~start) {
    result.push(query.substring(start))
  }

  return result
}

/**
 * fake method를 파싱해서 함수를 리턴한다.
 *
 * - 문자열: 문자열을 그대로 리턴한다.
 * - 배열: 아이템을 순차적으로 하나씩 리턴한다.
 * - 나머지는 fake함수를 호출한다.
 *
 * @param {string} method
 * @return {function}
 */
 function parseFakeMethod(method) {
   let fn
   if (/^(\'|\").*(\'|\")$/.test(method)) {
     // string
     const str = method.replace(/^[\'\"]/, '').replace(/[\'\"]$/, '')
     fn = () => str
   } else if (/^\[.*\]$/.test(method)) {
     // array
     // 하나씩 순차적으로 리턴한다.
     let i = 0;
     const arr = JSON.parse(method)
     fn = () => {
       if (i >= arr.length) i = 0
       return arr[i++]
     }
   } else if (/^\$\d+/.test(method)) {
     // 앞의 fake 결과를 참조
     const idx = parseInt(method.substr(1), 10)
     fn = () => getFakeResults(idx)
   } else {
     // fake method
     fn = () => {
       // fake method parameter에서 fakeResults를 참조하는지 확인
       let fakeMethod = method
       if (/\$\d+/.test(method)) {
         // 참조할 경우 method를 치환한다.
         const matcher = /\$(\d+)/g
         let match
         while ((match = matcher.exec(method)) !== null) {
           const idx = parseInt(match[1], 10)
           fakeMethod = method.replace(match[0], getFakeResults(idx))
         }
       }
       return faker.fake(`{{${fakeMethod}}}`)
     }
   }
   return fn
 }

/**
 * fake query에서 plugin을 찾아서 적용한 함수를 리턴한다.
 *
 * @param {string} query
 * @return {function}
 */
function parseFake(query) {

  // - 로 시작 할 경우 화면에 보여주지 않음
  // 하지만 fakeResults에는 저장
  const isHide = query.startsWith('-')
  if (isHide) {
    // - 제거
    query = query.substr(1).trim()
  }

  // plugin이 있는지 검사
  let idx = query.indexOf('|')
  if (!~idx) {
    // plugin이 없을 경우 fake로 리턴
    return saveFakeResult(parseFakeMethod(query), isHide) // () => faker.fake(`{{${query}}}`)
  }

  // fake string과 plugin을 분리
  const pluginMehotds = query.substring(idx + 1)

  // fake method
  let fn = parseFakeMethod(query.substring(0, idx).trim())

  function parseParam(s) {
    if (/^\d+$/.test(s)) {
      // Number
      return parseInt(s, 10)
    } else if (/^\[.*\]$/.test(s)) {
      // Array
      return JSON.parse(s)
    } else if (/^\/(.*?)\/[gimy]*$/.test(s)) {
      // Regexp
      const match = s.match(new RegExp('^/(.*?)/([gimy]*)$'));
      return new RegExp(match[1], match[2]);
    } else if (/^\$\d+/.test(s)) {
      // 앞의 fake 결과를 참조
      const idx = parseInt(s.substr(1), 10)
      return getFakeResults(idx)
    } else {
      return s
    }
  }

  function lazyCall(fn, method, params) {
    let plugin

    return () => {
      if (!plugin) {
        const parsedParams = params.map(param => {
          // trim과 앞/뒤 \'\" 제거
          const p = param.trim().replace(/^[\'\"]/, '').replace(/[\'\"]$/, '')
          return parseParam(p)
        })

        plugin = plugins[method](fn, ...parsedParams)
      }
      return plugin()
    }
  }

  const matchers = pluginMehotds.split('|')
  for (const matcher of matchers) {
    const prevFn = fn
    const method = /([^\(]+)/.exec(matcher)[1].trim()

    // 알 수 없는 method일 경우 예외 발생
    if (!plugins.hasOwnProperty(method)) {
      throw new Error(`Invalid plugin: ${method}`)
    }

    const params = /\((.*)\)/.exec(matcher)[1].split(',')

    fn = lazyCall(fn, method, params)
  }

  // save fake result
  return saveFakeResult(fn, isHide)
}
