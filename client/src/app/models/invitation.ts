export class Invitation {
    constructor() {
        this.permissions_id = 'null'
    }
    _id: string
    agency_id: string
    permissions_id: string
    email: string
    sender: string
    existing: boolean
}