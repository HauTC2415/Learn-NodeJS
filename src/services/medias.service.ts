import fs from 'fs'
import sharp from 'sharp'
import { Request } from 'express'
import fsPromises from 'fs/promises'

import PATHS from '~/constants/paths'
import {
  getNameFromFullName,
  handleUploadSingleImage,
  handleUploadMultiImages,
  handleUploadVideo,
  handleUploadVideoHLS
} from '~/utils/file'
import { getHost } from '~/utils/config.env'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/Orther'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'

class MediasService {
  async uploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newNameWithNewFormat = `${getNameFromFullName(file.newFilename)}.jpeg`
    const newPath = `${PATHS.UPLOADS_IMAGE}/${newNameWithNewFormat}`
    await sharp(file.filepath)
      .jpeg({ quality: 50 })
      .toFile(newPath)
      .then(() => {
        //remove file in temp folder
        if (file.filepath) fs.unlinkSync(file.filepath)
      })
    const rs: Media = {
      url: `${getHost}${PATHS.PREFIX_MEDIA}${PATHS.SERVE_IMAGES}/${newNameWithNewFormat}`,
      type: MediaType.IMAGE
    }
    return rs
  }

  async uploadMultiImages(req: Request) {
    const files = await handleUploadMultiImages(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newNameWithNewFormat = `${getNameFromFullName(file.newFilename)}.jpeg`
        const newPath = `${PATHS.UPLOADS_IMAGE}/${newNameWithNewFormat}`
        await sharp(file.filepath)
          .jpeg({ quality: 50 })
          .toFile(newPath)
          .then(() => {
            //remove file in temp folder
            if (file.filepath) fs.unlinkSync(file.filepath)
          })
        return {
          url: `${getHost}${PATHS.PREFIX_MEDIA}${PATHS.SERVE_IMAGES}/${newNameWithNewFormat}`,
          type: MediaType.IMAGE
        } as Media
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)

    const rs: Media[] = files.map((file) => {
      const { newFilename } = file
      return {
        //{PATHS.PREFIX_MEDIA}${PATHS.SERVE_VIDEOS} match with serve static in index.ts
        url: `${getHost}${PATHS.PREFIX_MEDIA}${PATHS.SERVE_VIDEOS}/${newFilename}`,
        type: MediaType.VIDEO
      } as Media
    })
    return rs
  }

  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideoHLS(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        await encodeHLSWithMultipleVideoStreams(file.filepath)
        const { newFilename, filepath } = file
        const path = getNameFromFullName(newFilename)
        await fsPromises.unlink(filepath) //remove file .mp4
        return {
          url: `${getHost}${PATHS.PREFIX_MEDIA}${PATHS.SERVE_VIDEOS}-stream-hls/${path}/master.m3u8`,
          type: MediaType.VIDEO_HLS
        } as Media
      })
    )
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
