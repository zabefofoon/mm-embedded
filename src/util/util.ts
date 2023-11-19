import ShortUniqueId from 'short-unique-id'

export const deepClone = <T>(value: T): T =>
  value ? JSON.parse(JSON.stringify(value)) : value

export const generateUniqueId = (): string =>
  new ShortUniqueId({
    length: 10,
    //HTML의 element에 id를 부여할 때, 맨 처음 숫자가 숫자면 에러
    dictionary: 'alpha',
  })()

export const removeSpacing = (str: string) =>
  str.replace(/\n|\r|\t|\s\s+/gi, '').replace(/>\s+</gi, '><')

export const prependUnit = (value: string, unit = 'px') => {
  return isNaN(Number(value)) 
  ? value 
  : value
  ? String(value + unit)
  : value
}
