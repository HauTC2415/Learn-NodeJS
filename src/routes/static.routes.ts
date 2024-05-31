import { Router } from 'express'
import PATHS from '~/constants/paths'
import {
  serveImageController,
  serveVideoStreamController,
  serveVideoM3U8Controller,
  serveVideoSegmentController
} from '~/controllers/static.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const staticRouter = Router()

staticRouter.get(`${PATHS.SERVE_IMAGES}/:filename`, wrapRequestHandler(serveImageController))

//Video stream
//{PATHS.SERVE_VIDEOS}-stream/:filename` => /videos-stream/:filename
const servingStreamVideoPrefix = PATHS.SERVE_VIDEOS + '-stream/:filename'
staticRouter.get(servingStreamVideoPrefix, wrapRequestHandler(serveVideoStreamController))
//Video HLS stream
const servingStreamHSLVideoPrefix = PATHS.SERVE_VIDEOS + '-stream-hls'
staticRouter.get(`${servingStreamHSLVideoPrefix}/:id/master.m3u8`, wrapRequestHandler(serveVideoM3U8Controller))
staticRouter.get(`${servingStreamHSLVideoPrefix}/:id/:v/:segment`, wrapRequestHandler(serveVideoSegmentController))

export default staticRouter
