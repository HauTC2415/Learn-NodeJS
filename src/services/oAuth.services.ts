import configEnv from '~/utils/config.env'
import axios from 'axios'
import { DefaultError } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import USER_MESSAGES from '~/constants/message'
import usersService from './users.services'
import databaseService from './database.services'
import { UserVerifyStatus } from '~/constants/enum'

class OAuthService {
  private async getOAuthGoogleToken(code: string) {
    const body = {
      code,
      client_id: configEnv.GOOGLE_CLIENT_ID,
      client_secret: configEnv.GOOGLE_CLIENT_SECRET,
      redirect_uri: configEnv.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }

    const response = await axios.post(configEnv.GOOGLE_OAUTH_TOKEN_URL as string, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data as { access_token: string; id_token: string; refresh_token: string }
  }

  private async getOAuthGoogleUserInfo(access_token: string, id_token: string) {
    const response = await axios.get(configEnv.GOOGLE_OAUTH_USERINFO_URL as string, {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      params: {
        id_token
      }
    })
    return response.data as {
      name: string
      picture: string
      email: string
      email_verified: boolean
      locale: string
    }
  }

  async oAuthGoogle(code: string) {
    const data = await this.getOAuthGoogleToken(code)
    const { access_token, id_token } = data
    const userInfo = await this.getOAuthGoogleUserInfo(access_token, id_token)
    if (!userInfo.email_verified) {
      throw new DefaultError({ message: USER_MESSAGES.GMAIL_NOT_VERIFIED, status: HTTP_STATUS.BAD_REQUEST })
    }
    const user = await databaseService.users.findOne({ email: userInfo.email })
    //if email is exist in database then login
    if (user) {
      const { access_token, refresh_token } = await usersService.signAccessTokenAndRefreshToken({
        user_id: user._id.toString(),
        verify_status: user.verify_status
      })
      await usersService.saveRefreshToken(user._id.toString(), refresh_token)
      return {
        access_token,
        refresh_token,
        new_user: 0,
        verify: user.verify_status
      }
    } else {
      const password = Math.random().toString(36).substring(7)
      const data = await usersService.register({
        name: userInfo.name,
        email: userInfo.email,
        password: password,
        confirm_password: password,
        date_of_birth: new Date().toISOString()
      })
      return {
        ...data,
        new_user: 1,
        verify: UserVerifyStatus.UNVERIFIED
      }
    }
  }
}

const oAuthService = new OAuthService()
export default oAuthService
