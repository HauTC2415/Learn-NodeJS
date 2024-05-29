import { Request, Response } from 'express'
import oAuthService from '~/services/oAuth.services'
import configEnv from '~/utils/config.env'

//https://console.cloud.google.com/apis/credentials/consent?project=oauth-nodejs-424706
export const oAuthController = async (req: Request, res: Response) => {
  const { code } = req.query
  const rs = await oAuthService.oAuthGoogle(code as string)
  //redirect to client web with access_token, refresh_token, new_user, verify
  return res.redirect(
    `${configEnv.CLIENT_REDIRECT_CALLBACK}?access_token=${rs.access_token}&refresh_token=${rs.refresh_token}&new_user=${rs.new_user}&verify=${rs.verify}`
  )
}
