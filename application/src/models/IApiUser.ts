export interface IApiUser {
    email: string;
    password: string;
    token: string;
    refreshToken: string;
    roles: Array<string>;
}