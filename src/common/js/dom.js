let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames ={
    standard: 'transform',
    Moz: 'MozTransform',
    O: 'OTransform',
    webkit: 'webkitTransform',
    ms: 'msTransform'
  }

  for (let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined){
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if(vendor === false) {
    return false
  }

  if(vendor == 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.slice(1)
}
