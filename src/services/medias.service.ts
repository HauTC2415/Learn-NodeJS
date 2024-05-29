import fs from 'fs'
import sharp from 'sharp'
import { Request } from 'express'

import PATHS from '~/constants/paths'
import { getNameFromFullName, handleUploadSingleImage } from '~/utils/file'
import configEnv, { isProduction } from '~/utils/config.env'

class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newNameWithNewFormat = `${getNameFromFullName(file.newFilename)}.jpeg`
    const newPath = `${PATHS.UPLOADS}/${newNameWithNewFormat}`
    sharp(file.filepath)
      .jpeg({ quality: 50 })
      .toFile(newPath)
      .then(() => {
        //remove file in temp folder
        if (file.filepath) fs.unlinkSync(file.filepath)
      })
    const host = isProduction ? configEnv.HOST : `${configEnv.HOST_DEV}:${configEnv.PORT}`
    return {
      url: `${host}${PATHS.PREFIX_MEDIA}/${newNameWithNewFormat}`
    }
  }
}
const mediasService = new MediasService()
export default mediasService
