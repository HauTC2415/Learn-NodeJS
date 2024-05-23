export interface LoginResponse {
  user_id: string
  access_token: string
  refresh_token: string
}

export interface RegisterResponse extends LoginResponse {}

export interface LogoutResponse {
  user_id: string
}
