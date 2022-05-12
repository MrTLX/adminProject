/**
 * 公共js基本方法封装
 */
import CryptoJS from 'crypto-js'
const utils = {
  /**
   * 加密数据
   * @param {*} data
   */
  getAES: function (data) {
    let pswKey
    let key = CryptoJS.enc.Utf8.parse(pswKey)
    let password = CryptoJS.enc.Utf8.parse(data)
    let base64 = CryptoJS.enc.Base64.stringify(password)
    let encrypted = CryptoJS.AES.encrypt(base64, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    let encryptedPwd = encrypted.toString()
    return encryptedPwd
  },
  /**
   * 根据value找label
   * @param data
   * @param val
   * @returns {string|*}
   */
  getLabelByval: function (data, val) {
    let obj = data.find((item) => Number(item.value) === Number(val))
    if (obj) {
      return obj.label
    } else {
      return ''
    }
  },
  /**
   * 深克隆
   * @param data
   * @param hash
   * @returns {{}|any}
   */
  deepClone: function (data, hash = new WeakMap()) {
    if (typeof data !== 'object' || data === null) {
      throw new TypeError('传入参数不是对象')
    }
    // 判断传入的待拷贝对象的引用是否存在于hash中
    if (hash.has(data)) {
      return hash.get(data)
    }
    let newData = {}
    const dataKeys = Object.keys(data)
    dataKeys.forEach((value) => {
      const currentDataValue = data[value]
      // 基本数据类型的值和函数直接赋值拷贝
      if (typeof currentDataValue !== 'object' || currentDataValue === null) {
        newData[value] = currentDataValue
      } else if (Array.isArray(currentDataValue)) {
        // 实现数组的深拷贝
        newData[value] = [...currentDataValue]
      } else if (currentDataValue instanceof Set) {
        // 实现set数据的深拷贝
        newData[value] = new Set([...currentDataValue])
      } else if (currentDataValue instanceof Map) {
        // 实现map数据的深拷贝
        newData[value] = new Map([...currentDataValue])
      } else {
        // 将这个待拷贝对象的引用存于hash中
        hash.set(data, data)
        // 普通对象则递归赋值
        newData[value] = utils.deepClone(currentDataValue, hash)
      }
    })
    return newData
  },
  regIp: function (ip) {
    let str =
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return str.test(ip)
  },
}

/**
 *对Date的扩展，将 Date 转化为指定格式的String
 *月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *例子：
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 *(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
  return fmt
}

export default utils
