const apiBaseUrl = "http://localhost:5000";

export const config = {
    clientRoutes: {
        home: "/",
        dashboard: "/dashboard",
        song: "/song"
    },
    api: {
        baseUrl: apiBaseUrl,
        routes: {
            authenticate: `${apiBaseUrl}/identity/authenticate`,
            refreshToken: `${apiBaseUrl}/identity/refreshToken`,
            signOut: `${apiBaseUrl}/identity/signOut`,
            songs: `${apiBaseUrl}/songs`,
            validateToken: `${apiBaseUrl}/identity/validateToken`
        }
    }
}