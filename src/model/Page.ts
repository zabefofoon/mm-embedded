import { generateUniqueId } from '../util/util'
import { Node } from './Node'

export class Page {
  id = generateUniqueId()
  name = 'Page'
  key = 0
  nodes = [Node.of()]

  constructor(page?: Page) {
    if (page) Object.assign(this, page)
  }

  removeNode(nodeId?: string) {
    this.nodes = this.nodes.filter(node => node.id !== nodeId)
  }

  static of(page?: Page) {
    return new Page(page)
  }
}
