
export type User = {
    id: number,
    username: string,
    email: string,
    // avatar: string | any,
    nickname: string | any,
    is_active?: any,
    is_superuser?: boolean,
    created_at?: string,
}

export type AssignType = {
    id: number,
    processAssign: ProcessAssignType
}

export type ProcessAssignType = Array<{
    id: number,
    process: number,
    item_id: number,
    status: number
}>