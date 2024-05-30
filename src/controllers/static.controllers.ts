import { getExtensionFromFullName } from './../utils/file'
import { Request, Response } from 'express'
import { omit } from 'lodash'
import ResponseBase from '~/common/Response.base'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIA_MESSAGES } from '~/constants/message'
import PATHS from '~/constants/paths'
import fs from 'fs'

export const serveImageController = async (req: Request, res: Response) => {
  const { filename } = req.params
  return res.sendFile(PATHS.UPLOADS_IMAGE + '/' + filename, (error) => {
    if (error) {
      const rsError = omit(error, 'path')
      res.status((error as any).status).json(new ResponseBase(MEDIA_MESSAGES.FILE_NOT_FOUND, { rsError }))
    }
  })
}

export const serveVideoStreamController = async (req: Request, res: Response) => {
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send(MEDIA_MESSAGES.REQUIRES_RANGE_HEADER)
  }
  const { filename } = req.params
  const videoPath = PATHS.UPLOADS_VIDEO_TEMP + '/' + filename
  //1MB = 10^6 bytes, calculator hệ 10. It
  //1MB = 2^20 bytes (1024 * 1024), calculator hệ 2

  //calculate size of file
  const videoSize = fs.statSync(videoPath).size
  //size for each stream video
  const chunkSize = 10 ** 6 //1MB
  //get byte start form header range (example: bytes=1234560-)
  const start = Number(range.replace(/\D/g, ''))
  //videoSize - 1 because start from 0, case choose videoSize is min, always less than videoSize
  const end = Math.min(start + chunkSize, videoSize - 1)

  // Dung lượng thực tế cho mỗi đoạn video stream
  // THường đây sẽ là chunkSize, ngoại trừ đoạn cuối cùng
  const contentLength = end - start + 1
  // const contentType = mime.getType(videoPath) || 'video/*'
  const getExtensionFromFullNameResult = getExtensionFromFullName(filename)

  const contentType =
    getExtensionFromFullNameResult === 'MOV'
      ? 'video/quicktime'
      : getExtensionFromFullNameResult === 'mp4'
        ? 'video/mp4'
        : 'video/*'

  /**
   * Format của header Content-Range: bytes <start>-<end>/<videoSize>
   * Ví dụ: Content-Range: bytes 1048576-3145727/3145728
   * Yêu cầu là `end` phải luôn luôn nhỏ hơn `videoSize`
   * ❌ 'Content-Range': 'bytes 0-100/100'
   * ✅ 'Content-Range': 'bytes 0-99/100'
   *
   * Còn Content-Length sẽ là end - start + 1. Đại diện cho khoản cách.
   * Để dễ hình dung, mọi người tưởng tượng từ số 0 đến số 10 thì ta có 11 số.
   * byte cũng tương tự, nếu start = 0, end = 10 thì ta có 11 byte.
   * Công thức là end - start + 1
   *
   * ChunkSize = 50
   * videoSize = 100
   * |0----------------50|51----------------99|100 (end)
   * stream 1: start = 0, end = 50, contentLength = 51
   * stream 2: start = 51, end = 99, contentLength = 49
   * contentLength of 2 streams = 51 + 49 = 100  === videoSize
   */
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }

  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
  // return res.sendFile(PATHS.UPLOADS_VIDEO + '/' + filename, (error) => {
  // return res.sendFile(PATHS.UPLOADS_VIDEO_TEMP + '/' + filename, (error) => {
  //   if (error) {
  //     console.log('error', error)
  //   }
  // })
}
