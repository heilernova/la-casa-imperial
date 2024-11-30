import { ApiUser } from "./api-user.interface";
import { IUserBase } from "./user.interfaces";

export const parserUserObjectToApiUser = (data: IUserBase): ApiUser => {
    return {
        id: data.id,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
        role: data.role,
        status: data.status,
        name: data.name,
        lastName: data.lastName,
        sex: data.sex,
        username: data.username,
        email: data.email,
        cellphone: data.cellphone,
        permissions: data.permissions
    }
}