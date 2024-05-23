import jwt from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'
import configEnv from './config.env'
import { PayloadJwtToken, TokenPayload } from '~/models/requests/User.requests'

const signToken = ({
  payload,
  secret_key = configEnv.SECRET_KEY as string,
  options
}: {
  payload: string | object | Buffer
  secret_key?: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret_key, options, (err, token) => {
      if (err) return reject(err)
      resolve(token as string)
    })
  })
}

const getExpiresAt = (tokenType: TokenType) => {
  switch (tokenType) {
    case TokenType.ACCESS_TOKEN:
      return configEnv.EXPIRES_AT
    case TokenType.REFRESH_TOKEN:
      return configEnv.EXPIRES_RT
    case TokenType.FORGOT_PASSWORD_TOKEN:
      return configEnv.EXPIRES_FPT
    case TokenType.VERIFY_EMAIL_TOKEN:
      return configEnv.EXPIRES_VET
    default:
      throw new Error('Invalid token type')
  }
}

const getSecretKey = (tokenType: TokenType) => {
  switch (tokenType) {
    case TokenType.ACCESS_TOKEN:
      return configEnv.JWT_SECRET_ACCESS_TOKEN_KEY
    case TokenType.REFRESH_TOKEN:
      return configEnv.JWT_SECRET_REFRESH_TOKEN_KEY
    case TokenType.VERIFY_EMAIL_TOKEN:
      return configEnv.JWT_SECRET_VERIFY_EMAIL_TOKEN_KEY
    case TokenType.FORGOT_PASSWORD_TOKEN:
      return configEnv.JWT_SECRET_FORGOT_PASSWORD_TOKEN_KEY
    default:
      throw new Error('Invalid token type')
  }
}

export const createJwtToken = async ({ payload, tokenType }: { payload: PayloadJwtToken; tokenType: TokenType }) => {
  const expires = getExpiresAt(tokenType)
  const secret_key = getSecretKey(tokenType)
  return await signToken({
    payload,
    secret_key: secret_key as string,
    options: {
      algorithm: configEnv.ALGORITHM as jwt.Algorithm,
      expiresIn: expires
    }
  })
}

export const verifyJwtToken = async (jwtToken: string, tokenType: TokenType) => {
  const secret_key = getSecretKey(tokenType)
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(
      jwtToken,
      secret_key as string,
      {
        algorithms: [configEnv.ALGORITHM as jwt.Algorithm]
      },
      (err, decoded) => {
        if (err) return reject(err)
        resolve(decoded as TokenPayload)
      }
    )
  })
}
