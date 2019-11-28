export function setRandomList (list) {
  let listCat = list.concat()
  let newList = []
  for (let i = 0; i < list.length; i++) {
    const j = Math.floor(Math.random() * listCat.length )
    newList.push(...listCat.splice(j, 1))
  }
  return newList
}
