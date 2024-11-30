import { OmitBy, PartialBy } from "@la-casa-imperial/core"

export interface IToken {
    id: string
    createAt: Date
    userId: string
    exp: Date | null
    ip: string
    platform: string
    device: string
}

export type TokenCreate = PartialBy<OmitBy<IToken, "id" | "createAt">, "exp">