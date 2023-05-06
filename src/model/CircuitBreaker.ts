export class CircuitBreaker {
  status: 'on' | 'off' = 'off'

  stack: number[] = []

  timer?: number

  watch(key: number) {
    this.stack.push(key)

    this.timer = setTimeout(() => {
      if (this.stack.length > 5) {
        this.status = 'on'

        setTimeout(() => {
          this.status = 'off'
          this.stack = []
          clearTimeout(this.timer)
        }, 250)
      }
    }, 250)
  }
}