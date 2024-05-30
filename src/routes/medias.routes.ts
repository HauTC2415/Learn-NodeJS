import { Router } from 'express'
import {
  uploadMultiImagesController,
  uploadSingleImageController,
  uploadVideoController
} from '~/controllers/medias.controller'
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

mediasRouter.post(
  '/upload-images',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadMultiImagesController)
)

mediasRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

export default mediasRouter
