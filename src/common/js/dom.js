export const myDOM = {
/**
 * 判断是否有该 class
 */
  hasClass (el, className) {
    const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  },
  /**
         * 添加 class
  */
  addClass (el, className) {
    if (this.hasClass(el, className)) {
      return
    }
    const newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  },
  // 获取点击元素的下标
  getData (el, name, val) {
    const prefix = 'data-'
    name = prefix + name
    if (val) {
      return el.setAttribute(name)
    } else {
      return el.getAttribute(name)
    }
  }
}
// 封装css样式props
const elementStyle = document.createElement('div').style
const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
