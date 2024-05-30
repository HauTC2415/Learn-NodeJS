import { Request, Response } from 'express'
import { omit } from 'lodash'
import ResponseBase from '~/common/Response.base'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIA_MESSAGES } from '~/constants/message'
import PATHS from '~/constants/paths'
import mediasService from '~/services/medias.service'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const data = await mediasService.handleUploadSingleImage(req)
  return res.status(HTTP_STATUS.OK).json(new ResponseBase(MEDIA_MESSAGES.UPLOAD_SUCCESS, data))
}

export const serveImageController = async (req: Request, res: Response) => {
  const { filename } = req.params
  return res.sendFile(PATHS.UPLOADS + '/' + filename, (error) => {
    if (error) {
      const rsError = omit(error, 'path')
      res.status((error as any).status).json(new ResponseBase(MEDIA_MESSAGES.FILE_NOT_FOUND, { rsError }))
    }
  })
}
