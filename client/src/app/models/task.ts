export class Task {
    constructor() {
        this.properties_ids = []
        this.notify = {
            target: 'vilcom',
            unit: 'hour',
            quantity: 1
        }
    }
    _id: string
    user_id: string
    client_id: string[]
    properties_ids: string[]
    title: string
    description: string
    date: Date
    expired: boolean
    reminder: boolean
    notify: {
        target: string,
        unit: string,
        quantity: number
    }
    action: string
    done: boolean
    canceled: boolean
}

// export class Reminder {
//     constructor() {
//         this.quantity = 1
//         this.unit = 'hour'
//     }
//     quantity: number
//     unit: string
// }