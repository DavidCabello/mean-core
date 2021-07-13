export class User {
   constructor() {
      this.properties_saved = []
      this.admin = false
      this.pro_expiration = new Date()
   }
   _id: string;
   agency_id: string;
   permissions_id: string
   email: string;
   password: string;
   pro_expiration: Date
   admin: boolean
   name: string;
   phone: string;
   properties_saved: []
 }
 
 export class Login {
    user: User;
    token: string;
    message: string;
 }
