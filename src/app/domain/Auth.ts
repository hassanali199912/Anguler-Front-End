export interface LoginRequest {
    email: string;
    password: string;
}


export interface LoginResponse {
    state: boolean | null;
    massage: string | null;
    statusCode: number | null;
    validation: object | null,
    dateTime: string | null;
    data: {
        expired: string | null,
        token: string | null
    }
}
