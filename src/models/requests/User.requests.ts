import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export interface PayloadJwtToken {
  user_id: string
  token_type: TokenType
}

//take note: extend JwtPayload and PayloadJwtToken
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
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
