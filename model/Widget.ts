export type Group = {
  name: string
  items: Item[]
}

export type Item = {
  id?: string
  html: string
  css: string
  name: string
  description: string
}