export function setRandomList (list) {
  let listCat = list.concat()
  let newList = []
  for (let i = 0; i < list.length; i++) {
    const j = Math.floor(Math.random() * listCat.length )
    newList.push(...listCat.splice(j, 1))
  }
  return newList
}

export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
