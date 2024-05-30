import { Router } from 'express'
import { serveImageController } from '~/controllers/medias.controller'
import { wrapRequestHandler } from '~/utils/handlers'

const staticRouter = Router()

staticRouter.get('/:filename', wrapRequestHandler(serveImageController))

export default staticRouter
