import { Request, Response } from 'express'
import ResponseBase from '~/common/Response.base'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIA_MESSAGES } from '~/constants/message'
import mediasService from '~/services/medias.service'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const data = await mediasService.uploadSingleImage(req)
  return res.status(HTTP_STATUS.OK).json(new ResponseBase(MEDIA_MESSAGES.UPLOAD_SUCCESS, data))
}

export const uploadMultiImagesController = async (req: Request, res: Response) => {
  const data = await mediasService.uploadMultiImages(req)
  return res.status(HTTP_STATUS.OK).json(new ResponseBase(MEDIA_MESSAGES.UPLOAD_SUCCESS, data))
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const data = await mediasService.uploadVideo(req)
  return res.status(HTTP_STATUS.OK).json(new ResponseBase(MEDIA_MESSAGES.UPLOAD_SUCCESS, data))
}

export const uploadVideoHLSController = async (req: Request, res: Response) => {
  const data = await mediasService.uploadVideoHLS(req)
  return res.status(HTTP_STATUS.OK).json(new ResponseBase(MEDIA_MESSAGES.UPLOAD_SUCCESS, data))
}
