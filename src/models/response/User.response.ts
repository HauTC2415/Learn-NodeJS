export interface UserResponse {
  user_id: string
  access_token: string
  refresh_token: string
}

export interface LoginResponse extends UserResponse {}
export interface RegisterResponse extends UserResponse {}
export interface RefreshTokenResponse extends UserResponse {}
export interface EmailVerifyTokenResponse extends UserResponse {}
export interface ResendEmailVerifyTokenResponse extends UserResponse {}

export interface LogoutResponse {
  user_id: string
}
