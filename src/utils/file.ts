import fs from 'fs'
import PATHS from '~/constants/paths'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import { DefaultError } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIA_MESSAGES } from '~/constants/message'

const initFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
    console.log(`created folder: ${folderPath}`)
  }
}

export const initUploadsTempFolder = () => {
  initFolder(PATHS.UPLOADS_TEMP)
}

export const handleUploadSingleImage = async (req: Request): Promise<File> => {
  const form = formidable({
    multiples: true,
    uploadDir: PATHS.UPLOADS_TEMP,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 300 * 1024 * 1024, //300MB
    filter: function ({ name, mimetype }) {
      const isValid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!isValid) {
        form.emit(
          'error' as any,
          new DefaultError({
            message: MEDIA_MESSAGES.INVALID_TYPE,
            status: HTTP_STATUS.BAD_REQUEST
          }) as any
        )
      }
      return isValid
    }
  })

  //convert callback to promise
  //because formidable does not support promise
  //and callback but throw error not return err for catch of wrapRequestHandler
  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(new DefaultError({ message: err.message, status: HTTP_STATUS.BAD_REQUEST }))
      }
      const fileIsEmpty = Object.keys(files).length === 0
      if (fileIsEmpty) {
        reject(
          new DefaultError({ message: MEDIA_MESSAGES.FILE_IS_REQUIRE_CAN_NOT_NULL, status: HTTP_STATUS.BAD_REQUEST })
        )
      }
      resolve((files.image as File[])[0])
    })
  })
}

export const getNameFromFullName = (fullName: string) => {
  const newName = fullName.split('.').slice(0, 1).join('_')
  return newName
}
