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

export const createJwtToken = async ({ payload, tokenType }: { payload: PayloadJwtToken; tokenType: TokenType }) => {
  const expires = getExpiresAt(tokenType)
  return await signToken({
    payload,
    options: {
      algorithm: configEnv.ALGORITHM as jwt.Algorithm,
      expiresIn: expires
    }
  })
}

export const verifyAccessToken = async (jwtToken: string) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(
      jwtToken,
      configEnv.SECRET_KEY as string,
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

export const verifyRefreshToken = async (jwtToken: string) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(
      jwtToken,
      configEnv.SECRET_KEY as string,
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
