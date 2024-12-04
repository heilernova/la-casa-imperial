export interface IToken {
    id: string;
    createdAt: Date;
    ip: string;
    platform: string | null;
    device: string;
}