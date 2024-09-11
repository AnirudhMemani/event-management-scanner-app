export const SERVER_URL = "https://api.pssemrevents.com";

// https://51da-106-51-116-120.ngrok-free.app

// https://api.pssemrevents.com

const version: string = "/api/v1";

export const URLS = {
    AUTH: version + "/auth",
    LOGIN: version + "/auth/organizer/login",
    ATHLETE: version + "/athlete",
    COACH: version + "/coach",
    MANAGER: version + "/manager",
    INDIVIDUAL: version + "/event/individual-events",
    GROUPS: version + "/event/group-events",
    CULTURAL: version + "/event/cultural-events",
    SCHOOL: version + "/school",
    CLAIM_MEAL: version + "/meal/verify-meal",
    GET_MEAL_DETAILS: version + "/meal/get-meal-details",
    GET_ALL_MEALS: version + "/meal/get-total-meal-summary",
};

export const AsyncStorageKeys = {
    token: "@access-token",
    user: "@user-details",
} as const;
