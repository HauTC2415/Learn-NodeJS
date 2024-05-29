import { Request, Response } from 'express'
import ResponseBase from '~/common/Response.base'
import { MEDIA_MESSAGES } from '~/constants/message'
import { handleUploadSingleImage } from '~/utils/file'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const data = await handleUploadSingleImage(req)
  return res.status(200).json(new ResponseBase(MEDIA_MESSAGES.UPLOAD_SUCCESS, data))
}
