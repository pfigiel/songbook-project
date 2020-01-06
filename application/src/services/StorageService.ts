export class StorageService {
    public static JWT_TOKEN: string = "jwtToken";
    public static REFRESH_TOKEN: string = "refreshToken";
    public static EMAIL: string = "email";
    public static ROLES: string = "roles";

    public static get(name: string): any {
        return localStorage.getItem(name);
    }

    public static set(name: string, value: any): void {
        localStorage.setItem(name, value);
    }

    public static remove(name: string): void {
        localStorage.removeItem(name);
    }
}