import { OmitBy } from "@la-casa-imperial/core";
import { Sex } from "../global";

export type UserRole = "admin" | "collaborator" | "customer";
export type UserStatus = "active" | "lock";

export interface IUserBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    status: UserStatus;
    username: string;
    email: string;
    name: string;
    lastName: string;
    sex: Sex;
    cellphone: string;
    pin: string | null;
    password: string;
    permissions: string[];
}

export interface IUser {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    status: UserStatus;
    username: string;
    email: string;
    name: string;
    lastName: string;
    sex: Sex;
    cellphone: string;
    permissions: string[];
}



export type UserCreateValues = OmitBy<IUserBase, "id" | "createdAt" | "updatedAt">;

export type UserUpdateValues = Partial<OmitBy<IUserBase, "id" | "createdAt" | "updatedAt">>;