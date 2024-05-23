import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { PayloadJwtToken, RegisterRequestBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { createJwtToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { RegisterResponse } from '~/models/response/User.response'

class UsersService {
  private signAccessToken(user_id: string) {
    const _payload: PayloadJwtToken = { user_id, token_type: TokenType.ACCESS_TOKEN }
    return createJwtToken({
      payload: _payload,
      tokenType: TokenType.ACCESS_TOKEN
    })
  }
  private signRefreshToken(user_id: string) {
    const _payload: PayloadJwtToken = { user_id, token_type: TokenType.REFRESH_TOKEN }
    return createJwtToken({
      payload: _payload,
      tokenType: TokenType.REFRESH_TOKEN
    })
  }

  private async valueReturnOfRegisterAndLoginSuccess(user_id: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      user_id,
      access_token,
      refresh_token
    } as RegisterResponse
  }

  private async getOldRefreshToken(user_id: string) {
    const isExist = await databaseService.refreshTokens.findOne({ user_id: new ObjectId(user_id) })
    return isExist
  }

  private async deleteOldRefreshToken(user_id: string) {
    await databaseService.refreshTokens.deleteOne({ user_id: new ObjectId(user_id) })
  }

  private async saveRefreshToken(user_id: string, refresh_token: string) {
    const oldRefreshToken = await this.getOldRefreshToken(user_id)
    if (oldRefreshToken) await this.deleteOldRefreshToken(user_id)
    const refreshToken = new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    await databaseService.refreshTokens.insertOne(refreshToken)
  }

  async register(data: RegisterRequestBody) {
    const user = new User({
      ...data,
      date_of_birth: new Date(data.date_of_birth),
      password: hashPassword(data.password)
    })
    const rs = await databaseService.users.insertOne(user)
    const user_id = rs.insertedId.toString()

    const userRes = await this.valueReturnOfRegisterAndLoginSuccess(user_id)
    const { refresh_token } = userRes
    await this.saveRefreshToken(user_id, refresh_token)
    return userRes
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return user ? true : false
  }

  async getUser(email: string, rawPassword: string) {
    const hashPw = hashPassword(rawPassword)
    const user = await databaseService.users.findOne({ email, password: hashPw })
    return user
  }

  async login(user_id: string) {
    const userRes = await this.valueReturnOfRegisterAndLoginSuccess(user_id)
    const { refresh_token } = userRes
    await this.saveRefreshToken(user_id, refresh_token)
    return userRes
  }
  async getUserById(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    return user
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
  }
}

const usersService = new UsersService()
export default usersService
