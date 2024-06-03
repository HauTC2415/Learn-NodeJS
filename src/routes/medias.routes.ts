import { Router } from 'express'
import {
  getVideoStatusController,
  uploadMultiImagesController,
  uploadSingleImageController,
  uploadVideoController,
  uploadVideoHLSController
} from '~/controllers/medias.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Description: Upload single image
 * Method: POST
 * Request: /medias/upload-image
 * Request body: { image: File }
 */
mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadSingleImageController)
)
/**
 * Description: Upload multiple images
 * Method: POST
 * Request: /medias/upload-images
 * Request body: { images: [File] }
 */
mediasRouter.post(
  '/upload-images',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadMultiImagesController)
)

/**
 * Description: Upload video
 * Method: POST
 * Request: /medias/upload-video
 * Request body: { video: File }
 */
mediasRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

/**
 * Description: Upload video HLS
 * Method: POST
 * Request: /medias/upload-video-hls
 * Request body: { video: File }
 */
mediasRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoHLSController)
)

/**
 * Description: Get video status
 * Method: GET
 * Request: /medias/video-status/:id
 * Request body: {}
 */
mediasRouter.get(
  '/video-status/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getVideoStatusController)
)

export default mediasRouter
