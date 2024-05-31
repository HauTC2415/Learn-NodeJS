import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import {
  PayloadJwtToken,
  RegisterRequestBody,
  TokenPayload,
  UpdateMeRequestBody
} from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { createJwtToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { UserResponse } from '~/models/response/User.response'
import Follow from '~/models/schemas/Follower.schema'

class UsersService {
  private signAccessToken({ user_id, verify_status }: { user_id: string; verify_status: UserVerifyStatus }) {
    const _payload: PayloadJwtToken = { user_id, token_type: TokenType.ACCESS_TOKEN, verify_status }
    return createJwtToken({
      payload: _payload,
      tokenType: TokenType.ACCESS_TOKEN
    })
  }
  private signRefreshToken({ user_id, verify_status }: { user_id: string; verify_status: UserVerifyStatus }) {
    const _payload: PayloadJwtToken = { user_id, token_type: TokenType.REFRESH_TOKEN, verify_status }
    return createJwtToken({
      payload: _payload,
      tokenType: TokenType.REFRESH_TOKEN
    })
  }

  private signEmailVerifyToken({ user_id, verify_status }: { user_id: string; verify_status: UserVerifyStatus }) {
    const _payload: PayloadJwtToken = { user_id, token_type: TokenType.VERIFY_EMAIL_TOKEN, verify_status }
    return createJwtToken({
      payload: _payload,
      tokenType: TokenType.VERIFY_EMAIL_TOKEN
    })
  }

  private signForgotPasswordToken({ user_id, verify_status }: { user_id: string; verify_status: UserVerifyStatus }) {
    const _payload: PayloadJwtToken = { user_id, token_type: TokenType.FORGOT_PASSWORD_TOKEN, verify_status }
    return createJwtToken({
      payload: _payload,
      tokenType: TokenType.FORGOT_PASSWORD_TOKEN
    })
  }

  public async signAccessTokenAndRefreshToken({
    user_id,
    verify_status
  }: {
    user_id: string
    verify_status: UserVerifyStatus
  }) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify_status }),
      this.signRefreshToken({ user_id, verify_status })
    ])
    return { access_token, refresh_token }
  }

  private async userResponse({
    user_id,
    verify_status = UserVerifyStatus.UNVERIFIED
  }: {
    user_id: string
    verify_status?: UserVerifyStatus
  }) {
    const { access_token, refresh_token } = await this.signAccessTokenAndRefreshToken({ user_id, verify_status })
    return {
      user_id,
      access_token,
      refresh_token
    } as UserResponse
  }

  private async getOldRefreshToken(user_id: string) {
    const oldRefreshToken = await databaseService.refreshTokens.findOne({ user_id: new ObjectId(user_id) })
    return oldRefreshToken
  }

  private async deleteOldRefreshToken(user_id: string) {
    await databaseService.refreshTokens.deleteOne({ user_id: new ObjectId(user_id) })
  }

  public async saveRefreshToken(user_id: string, refresh_token: string) {
    const oldRefreshToken = await this.getOldRefreshToken(user_id)
    if (oldRefreshToken) await this.deleteOldRefreshToken(user_id)
    const refreshToken = new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    await databaseService.refreshTokens.insertOne(refreshToken)
  }

  // Register user
  async register(data: RegisterRequestBody) {
    const user_id = new ObjectId().toString()
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify_status: UserVerifyStatus.UNVERIFIED })
    const user = new User({
      ...data,
      _id: new ObjectId(user_id),
      date_of_birth: new Date(data.date_of_birth),
      password: hashPassword(data.password),
      email_verify_token: email_verify_token,
      username: `user${user_id}`
    })
    await databaseService.users.insertOne(user)
    const userRes = await this.userResponse({ user_id })
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
    const user = await databaseService.users.findOne({ email, password: hashPw }, { projection: { password: 0 } })
    return user
  }

  // Login
  async login({ user_id, verify_status }: { user_id: string; verify_status: UserVerifyStatus }) {
    const userRes = await this.userResponse({ user_id, verify_status })
    const { refresh_token } = userRes
    await this.saveRefreshToken(user_id, refresh_token)
    return userRes
  }

  async getUserById(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    return user
  }

  // Logout
  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
  }

  async refreshToken({
    refresh_token_payload,
    old_refresh_token
  }: {
    refresh_token_payload: TokenPayload
    old_refresh_token: string
  }) {
    const { user_id, verify_status } = refresh_token_payload

    const [new_access_and_refresh_token, _] = await Promise.all([
      this.userResponse({ user_id, verify_status }),
      //delete old refresh token
      databaseService.refreshTokens.deleteOne({ token: old_refresh_token })
    ])
    await this.saveRefreshToken(user_id, new_access_and_refresh_token.refresh_token)
    const { refresh_token, access_token } = new_access_and_refresh_token
    return { user_id, refresh_token, access_token }
  }

  async verifyEmail(user_id: string) {
    //MongoDB updateOne method for date type field:
    //  - $currentDate: update field updated_at
    //  - $$NOW: update field updated_at with current date
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          verify_status: UserVerifyStatus.VERIFIED,
          email_verify_token: ''
          // updated_at: new Date() //create new Date() in server
        },
        $currentDate: { updated_at: true }
      }
    )
    const userRes = await this.userResponse({ user_id, verify_status: UserVerifyStatus.VERIFIED })
    const { refresh_token } = userRes
    await this.saveRefreshToken(user_id, refresh_token)
    return userRes
  }

  async resendEmailVerifyToken(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify_status: UserVerifyStatus.UNVERIFIED })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token
          // updated_at: new Date() //create new Date() in server
        },
        $currentDate: { updated_at: true }
      }
    )
    const userRes = await this.userResponse({ user_id })

    const { refresh_token } = userRes
    await this.saveRefreshToken(user_id, refresh_token)

    return userRes
  }

  async forgotPassword({ user_id, verify_status }: { user_id: string; verify_status: UserVerifyStatus }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify_status })
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token,
          updated_at: '$$NOW'
        }
      }
    ])
    //TODO: send email: link with forgot_password_token
  }

  async resetPassword(user_id: string, password: string) {
    const hashPw = hashPassword(password)
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          password: hashPw,
          forgot_password_token: '',
          updated_at: '$$NOW'
        }
      }
    ])
    return { user_id }
  }

  async me(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )
    return user
  }
  async updateMe(user_id: string, data: UpdateMeRequestBody) {
    const _data = data.date_of_birth ? { ...data, date_of_birth: new Date(data.date_of_birth) } : data
    const rs = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      [
        {
          $set: {
            // ..._data,
            //TODO: add validator for mongodb schema
            ...(_data as UpdateMeRequestBody & { date_of_birth?: Date }),
            updated_at: '$$NOW'
          }
        }
      ],
      { returnDocument: 'after', projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )
    return rs
  }

  async getProfile(username: string) {
    const user = await databaseService.users.findOne(
      { username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify_status: 0,
          updated_at: 0,
          _id: 0
        }
      }
    )
    return user
  }

  async followUser(user_id: string, user_id_follow: string) {
    const follow = new Follow({ user_id: new ObjectId(user_id), follower_user_id: new ObjectId(user_id_follow) })
    const rs = await databaseService.followers.insertOne(follow)
    if (!rs) return null
    const record = await databaseService.followers.findOne({ _id: rs.insertedId })
    return record
  }

  async unFollowUser(user_id: string, user_id_follow: string) {
    const rs = await databaseService.followers.deleteOne({
      user_id: new ObjectId(user_id),
      follower_user_id: new ObjectId(user_id_follow)
    })
    return {
      user_id,
      user_id_follow
    }
  }

  async checkUsernameExist(username: string) {
    const user = await databaseService.users.findOne({ username })
    return user ? true : false
  }

  async changePassword({ user_id, new_password }: { user_id: string; new_password: string }) {
    const hashPw = hashPassword(new_password)
    const rs = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      [
        {
          $set: {
            password: hashPw,
            updated_at: '$$NOW'
          }
        }
      ],
      { returnDocument: 'after', projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )
    return rs
  }
}

const usersService = new UsersService()
export default usersService
