import { ApiSession } from '@la-casa-imperial/schemas/auth';
import { UserRole } from '@la-casa-imperial/schemas/users';
export class Session {
    private readonly pin: string | null;
    public readonly token: string;
    public readonly name: string;
    public readonly lastName: string;
    public readonly role: UserRole;
    public readonly username: string;
    public readonly permissions: string[];

    constructor(data: ApiSession){
        this.token = data.token;
        this.name = data.name;
        this.lastName = data.lastName;
        this.role = data.role;
        this.username = data.username;
        this.permissions = data.permissions;
        this.pin = data.pin;
    }


    validated(): boolean {
        return [
            typeof this.token === "string",
            typeof this.name === "string",
            typeof this.lastName === "string",
            Array.isArray(this.permissions)
        ].every(Boolean);
    }
      
}