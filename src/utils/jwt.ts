import jwt from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

// process.env.SECRET_KEY as string
const signToken = ({
  payload,
  secret_key = process.env.SECRET_KEY as string,
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
      return process.env.EXPIRES_AT
    case TokenType.REFRESH_TOKEN:
      return process.env.EXPIRES_RT
    case TokenType.FORGOT_PASSWORD_TOKEN:
      return process.env.EXPIRES_FPT
    case TokenType.VERIFY_EMAIL_TOKEN:
      return process.env.EXPIRES_VET
    default:
      throw new Error('Invalid token type')
  }
}

export const createJwtToken = async ({
  payload,
  tokenType
}: {
  payload: string | object | Buffer
  tokenType: TokenType
}) => {
  const expires = getExpiresAt(tokenType)
  return await signToken({
    payload,
    options: {
      algorithm: process.env.ALGORITHM as jwt.Algorithm,
      expiresIn: expires
    }
  })
}

// export const verifyJwtToken = async (jwtToken: string) => {
//   return new Promise<object>((resolve, reject) => {
//     jwt.verify(jwtToken, process.env.SECRET_KEY as string, (err, decoded) => {
//       if (err) return reject(err)
//       resolve(decoded as object)
//     })
//   })
// }
