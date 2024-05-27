import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'

export interface PayloadJwtToken {
  user_id: string
  token_type: TokenType
  verify_status: UserVerifyStatus
}

//take note: extend "JwtPayload" and "PayloadJwtToken"
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify_status: UserVerifyStatus
}

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface RefreshTokenRequestBody extends LogoutRequestBody {}

export interface EmailVerifyTokenRequestBody {
  email_verify_token: string
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface VerifyForgotPasswordTokenRequestBody {
  forgot_password_token: string
}

export interface ResetPasswordBodyRequestBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface UpdateMeRequestBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}
