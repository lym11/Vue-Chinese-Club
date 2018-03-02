import Vue from 'vue'
export default Vue.filter('timeTemplate', function (str) {
  let seconds = (new Date().getTime() - new Date(str).getTime()) / 1000
  let timeStr
  let isMinute = parseInt(seconds / 60)
  let isHour = parseInt(seconds / 3600)
  let isDay = parseInt(seconds / 3600 / 24)
  let isMonth = parseInt(seconds / 3600 / 24 / 30)
  let isYear = parseInt(seconds / 3600 / 24 / 365)
  if (isMinute <= 1) {
    timeStr = `刚刚`
  } else if (isMinute > 1 && isMinute < 60) {
    timeStr = `${isMinute}分钟前`
  } else if (isHour >= 1 && isHour < 24) {
    timeStr = `${isHour}小时前`
  } else if (isDay >= 1 && isDay < 30) {
    timeStr = `${isDay}天前`
  } else if (isMonth >= 1 && isMonth < 12) {
    timeStr = `${isMonth}月前`
  } else if (isYear >= 1) {
    timeStr = `${isYear}年前`
  }
  return timeStr
})
Vue.filter('typeTemplate', function (data) {
  let str = ''
  if (data.top) {
    str = '置顶'
  } else if (data.good) {
    str = '精华'
  } else if (data.tab === 'share') {
    str = '分享'
  } else if (data.tab === 'ask') {
    str = '问答'
  } else if (data.tab === 'job') {
    str = '招聘'
  } else if (data.tab === 'weex') {
    str = 'weex'
  }
  return str
})
