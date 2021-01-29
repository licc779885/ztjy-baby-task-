// 时间转换为时间戳
export function	formatTotimemap (date) {
  if (!date) return ''
  return new Date(date).getTime()
}

// localStorage
export function setStorage (key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.log('setStorage error', error)
    return false
  }
}
export function getStorage (key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (error) {
    console.log('getStorage error', error)
    return ''
  }
}

// string to base64
export function strToBase64 (value = '') {
  try {
    return btoa(JSON.stringify(value))
  } catch (error) {
    console.log('enBase64 error', error)
    return ''
  }
}
// base64 to string
export function base64ToString (value = '') {
  try {
    return atob(JSON.stringify(value))
  } catch (error) {
    console.log('deBase64 error', error)
    return ''
  }
}

// sessionStorage
export class SessionStorage {
  static setItem (key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.log('SessionStorage setStorage error', error)
      return false
    }
  }
  static getItem (key) {
    try {
      return JSON.parse(sessionStorage.getItem(key))
    } catch (error) {
      console.log('SessionStorage getStorage error', error)
      return ''
    }
  }
}


// cookie
/**
 * 设置cookie
 * @param {*} name 
 * @param {*} value 
 * @param {秒数} seconds 
 */
export function setCookie(name, value, seconds) {
  seconds = seconds || 0;   //seconds有值就直接赋值，没有为0。
  var expires = "";
  if (seconds != 0 ) {      //设置cookie有效时间
    var date = new Date();
    date.setTime(date.getTime()+(seconds*1000));
    expires = "; expires="+date.toGMTString();
  }
  document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值
}
// 取得cookie
export function getCookie(name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';') // 把cookie分割成组
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i] // 取得字符串
    while (c.charAt(0) == ' ') { // 判断一下字符串有没有前导空格
      c = c.substring(1, c.length) // 有的话，从第二位开始取
    }
    if (c.indexOf(nameEQ) == 0) { // 如果含有我们要的name
      return unescape(c.substring(nameEQ.length, c.length)) // 解码并截取我们要值
    }
  }
  return false
}
// 清除cookie
export function clearCookie(name) {
  setCookie(name, "", -1);
}