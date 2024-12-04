import { HttpClient } from '@angular/common/http';
import { ApiSession } from '@la-casa-imperial/schemas/auth';
import { UserRole } from '@la-casa-imperial/schemas/users';
import { ApiProfile, ApiProfileUpdate  } from '@la-casa-imperial/schemas/profile';
import { capitalize } from '@la-casa-imperial/core';

export class Session {
    private readonly pin: string | null;
    public readonly token: string;
    public readonly name: string;
    public readonly lastName: string;
    public readonly role: UserRole;
    public readonly username: string;
    public readonly permissions: string[];

    constructor(data: ApiSession, private readonly _http: HttpClient){
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

    getInfo(): Promise<ApiProfile> {
        return new Promise((resolve, reject) => {

            this._http.get<ApiProfile>("profile").subscribe({
                next: res => {
                    resolve(res);
                },
                error: err => reject(err)
            })
        });
    }
    
    update(data: ApiProfileUpdate): Promise<void> {
        return new Promise((resolve, reject) => {
            this._http.put<void>("profile", data).subscribe({
                next: () => {
                    if (data.email) data.email = data.email.toLowerCase();
                    if (data.name) data.name = capitalize(data.name);
                    if (data.lastName) data.lastName = capitalize(data.lastName);
                    
                    const properties = Object.fromEntries(
                        Object.entries(data).map(([key, value]) => [key, { value }])
                    );
                    
                    Object.defineProperties(this, properties)

                    resolve();
                },
                error: err => reject(err)
            })
        })
    }
}