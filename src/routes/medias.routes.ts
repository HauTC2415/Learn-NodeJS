import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 *
 */
mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadSingleImageController)
)

export default mediasRouter
