import { Router } from 'express'
import { oAuthController } from '~/controllers/oAuth.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const oAuthRouter = Router()

/**
 * Description: oAuth
 * Path: /oauth/google
 * Method: GET
 * Query: {code: string}
 * URL gg cloud: https://console.cloud.google.com/apis/credentials/consent?project=oauth-nodejs-424706
 */
oAuthRouter.get('/oauth/google', wrapRequestHandler(oAuthController))

export default oAuthRouter
