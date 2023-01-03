// db.ts
import Dexie, { Table } from 'dexie'

class MySubClassedDexie extends Dexie {
    constructor() {
        super('todo-today')
        this.version(1).stores({})
    }
}

const db = new MySubClassedDexie()

export default db
