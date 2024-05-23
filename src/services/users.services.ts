import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { createJwtToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'

class UsersService {
  private signAccessToken(user_id: string) {
    return createJwtToken({ payload: { user_id, type: TokenType.ACCESS_TOKEN }, tokenType: TokenType.ACCESS_TOKEN })
  }
  private signRefreshToken(user_id: string) {
    return createJwtToken({ payload: { user_id, type: TokenType.REFRESH_TOKEN }, tokenType: TokenType.REFRESH_TOKEN })
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
    }
  }

  async register(data: RegisterRequestBody) {
    const user = new User({
      ...data,
      date_of_birth: new Date(data.date_of_birth),
      password: hashPassword(data.password)
    })
    const rs = await databaseService.users.insertOne(user)
    const user_id = rs.insertedId.toString()

    const res = await this.valueReturnOfRegisterAndLoginSuccess(user_id)
    return res
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
    const res = await this.valueReturnOfRegisterAndLoginSuccess(user_id)
    return res
  }
}

const usersService = new UsersService()
export default usersService
