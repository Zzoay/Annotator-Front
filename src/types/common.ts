
export interface User {
    id: number,
    username: string,
    email: string,
    // avatar: string | any,
    nickname: string | any,
    is_active?: any,
    is_superuser?: boolean,
    created_at?: string,
}