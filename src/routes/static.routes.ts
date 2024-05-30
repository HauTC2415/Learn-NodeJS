import { Router } from 'express'
import PATHS from '~/constants/paths'
import { serveImageController, serveVideoStreamController } from '~/controllers/static.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const staticRouter = Router()

staticRouter.get(`${PATHS.SERVE_IMAGES}/:filename`, wrapRequestHandler(serveImageController))
staticRouter.get(`${PATHS.SERVE_VIDEOS}-stream/:filename`, wrapRequestHandler(serveVideoStreamController))

export default staticRouter
