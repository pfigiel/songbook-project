export class StorageService {
    public static jwtToken: string = "jwtToken";

    public get(name: string): any {
        return localStorage.getItem(name);
    }

    public set(name: string, value: any): void {
        localStorage.setItem(name, value);
    }
}