import type {Action} from "./Action"

export class ActionManager {

  readonly actions: Action[] = []

  readonly undoneActions: Action[] = []

  constructor() {
  }

  execute(action: Action): Action {
    action.do()
    this.actions.push(action)
    this.emptyUndoneActions()
    return action;
  }

  executeUndo(): Action | undefined {
    const lastAction = this.actions.pop()
    if (lastAction) {
      lastAction.undo()
      this.undoneActions.push(lastAction)
      return lastAction
    }
  }

  executeRedo(): Action | undefined {
    const lastUndoneAction = this.undoneActions.pop()
    if (lastUndoneAction) {
      lastUndoneAction.redo()
      this.actions.push(lastUndoneAction)
      return lastUndoneAction
    }
  }

  emptyActions(): void {
    this.actions.splice(0, this.actions.length)
    this.emptyUndoneActions()
  }

  private emptyUndoneActions(): void {
    this.undoneActions.splice(0, this.undoneActions.length)
  }
}