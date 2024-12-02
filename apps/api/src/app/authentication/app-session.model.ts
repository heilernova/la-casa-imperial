import { UserRole, UserStatus } from "@la-casa-imperial/schemas/users";

export class AppSession {
    public readonly user: { id: string; role: UserRole, status: UserStatus, email: string, permissions: string[] }
    public readonly token: string;

    constructor(data: { id: string, email: string, role: UserRole, status: UserStatus, permissions: string[], token: string }){
        this.token = data.token;
        this.user = {
            id: data.id,
            role: data.role,
            email: data.email,
            permissions: data.permissions,
            status: data.status
        }
    }
}
