import { generateUniqueId } from '../util/util'
import { Node } from './Node'

export class Page {
  id = generateUniqueId()
  name = 'Page'
  key = 0
  nodes = [Node.of()]

  removeNode(nodeId?: string) {
    this.nodes = this.nodes.filter((node) => node.id !== nodeId)
  }

  static of() {
    return new Page()
  }
}
