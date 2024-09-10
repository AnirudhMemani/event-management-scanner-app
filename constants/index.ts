export const SERVER_URL: string =
    process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000";

const version: string = "/api/v1";

export const URLS = {
    AUTH: version + "/auth",
    USERS: version + "/users",
    ATHLETE: version + "/athlete",
    COACH: version + "/coach",
    MANAGER: version + "/manager",
    INDIVIDUAL: version + "/event/individual-events",
    GROUPS: version + "/event/group-events",
    CULTURAL: version + "/event/cultural-events",
    SCHOOL: version + "/school",
};

export const AsyncStorageKeys = {
    token: "@access-token",
    user: "@user-details",
} as const;
