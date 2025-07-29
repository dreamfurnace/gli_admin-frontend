export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginFormState {
    form: LoginCredentials;
    error: string;
    isLoading: boolean;
}

export interface AdminPermission {
    id: number;
    name: string;
    codename: string;
    description: string | null;
}

export interface AdminGrade {
    id: number;
    name: string;
    description: string | null;
    permissions?: AdminPermission[];
}

export interface AdminUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    grade: AdminGrade;
    last_login_ip: string | null;
    created_at: string;
    updated_at: string;
}

// 관리자 업데이트 시 사용되는 데이터 타입
export interface AdminUpdateData {
    grade_id: number;
    is_active: boolean;
}

export interface InitializeAuthFunction {
    (): Promise<void>;
    isRetrying?: boolean;
}
