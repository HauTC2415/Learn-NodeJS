import fs from 'fs'
import PATHS from '~/constants/paths'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import { DefaultError } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIA_MESSAGES } from '~/constants/message'

//#region PRIVATE
const initFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
    console.log(`created folder: ${folderPath}`)
  }
}
//#endregion

export const initUploadsTempFolder = () => {
  initFolder(PATHS.UPLOADS_IMAGE_TEMP) //create folder uploads/images/temp
  initFolder(PATHS.UPLOADS_VIDEO_TEMP) //create folder uploads/videos/temp
}

export const handleUploadSingleImage = async (req: Request): Promise<File> => {
  const form = formidable({
    multiples: true,
    uploadDir: PATHS.UPLOADS_IMAGE_TEMP,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 300 * 1024 * 1024, //300MB
    filter: function ({ name, mimetype }) {
      const isValid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!isValid) {
        form.emit(
          'error' as any,
          new DefaultError({
            message: MEDIA_MESSAGES.INVALID_UPLOAD_SINGLE_IMAGE_TYPE,
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

export const handleUploadMultiImages = async (req: Request): Promise<File[]> => {
  const MAX_FILES = 4
  const form = formidable({
    multiples: true,
    uploadDir: PATHS.UPLOADS_IMAGE_TEMP,
    keepExtensions: true,
    maxFiles: MAX_FILES,
    maxTotalFileSize: 500 * 1024 * MAX_FILES, //500KB * MAX_FILES
    filter: function ({ name, mimetype }) {
      const isValid = name === 'images' && Boolean(mimetype?.includes('image/'))
      if (!isValid) {
        form.emit(
          'error' as any,
          new DefaultError({
            message: MEDIA_MESSAGES.INVALID_UPLOAD_MULTI_IMAGES_TYPE,
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
  return new Promise<File[]>((resolve, reject) => {
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
      resolve(files.images as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const MAX_FILES = 1
  const form = formidable({
    multiples: true,
    uploadDir: PATHS.UPLOADS_VIDEO_TEMP,
    // keepExtensions: true,
    maxFiles: MAX_FILES,
    maxTotalFileSize: 500 * 1024 * 1024 * MAX_FILES, //500MB * MAX_FILES
    filter: function ({ name, mimetype }) {
      const extensions = ['mp4', 'quicktime']
      const isCorrectType = extensions.some((ext) => Boolean(mimetype?.includes(ext)))
      const isCorrectFieldName = name === 'video'
      const isValid = isCorrectType && isCorrectFieldName
      if (!isValid) {
        form.emit(
          'error' as any,
          new DefaultError({
            message: MEDIA_MESSAGES.INVALID_UPLOAD_MULTI_IMAGES_TYPE,
            status: HTTP_STATUS.BAD_REQUEST
          }) as any
        )
      }
      return isValid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
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
      //rename filepath and newFilename, because not use keepExtensions: true.
      // filepath: ~/abc => ~/abc.mp4
      // newFilename: abc => abc.mp4
      const videos = files.video as File[]
      if (videos.length === 0)
        reject(
          new DefaultError({ message: MEDIA_MESSAGES.FILE_IS_REQUIRE_CAN_NOT_NULL, status: HTTP_STATUS.BAD_REQUEST })
        )
      videos.forEach((video) => {
        const originalFilename = video.originalFilename as string
        const extensionsFile = getExtensionFromFullName(originalFilename)
        const newFilepath = `${video.filepath}.${extensionsFile}`
        //update filepath
        fs.renameSync(video.filepath, newFilepath)
        //update newFilename
        video.newFilename = video.newFilename + '.' + extensionsFile
      })
      resolve(files.video as File[])
    })
  })
}

export const getNameFromFullName = (fullName: string) => {
  const newName = fullName.split('.').slice(0, 1).join('_')
  return newName
}

export const getExtensionFromFullName = (fullName: string) => {
  const extension = fullName.split('.').slice(1, 2).join('')
  return extension
}
