export class User {
    _id: string;
    name: string;
    lastname: string;
    phone: string;
    email: string;
    password: string;
    role: string;
 }
 
 export class Login {
    user: User;
    token: string;
    message: string;
 }
