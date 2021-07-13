export class Role {
    _id: string
    agency_id: string
    name: string
    default: boolean
    create_property: boolean
    edit_properties: boolean
    delete_properties: boolean
    invite_agent: boolean
    remove_agent: boolean
    manage_roles: boolean
    agency_stats: boolean
    agency_activity: boolean
    agency_info: boolean
}