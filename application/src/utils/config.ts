const apiBaseUrl = "http://localhost:5000";

export const config = {
    clientRoutes: {
        editSong: "/editSong",
        home: "/",
        dashboard: "/dashboard",
        song: "/song",
        signIn: "/signIn",
        register: "/register"
    },
    api: {
        baseUrl: apiBaseUrl,
        routes: {
            addSong: `${apiBaseUrl}/songs/add`,
            modifySong: `${apiBaseUrl}/songs/modify`,
            deleteSong: `${apiBaseUrl}/songs/delete`,
            authenticate: `${apiBaseUrl}/identity/authenticate`,
            refreshToken: `${apiBaseUrl}/identity/refreshToken`,
            register: `${apiBaseUrl}/identity/register`,
            signOut: `${apiBaseUrl}/identity/signOut`,
            songs: `${apiBaseUrl}/songs`,
            validateToken: `${apiBaseUrl}/identity/validateToken`
        }
    }
}