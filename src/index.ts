import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { appErrorHandler } from './utils/handlers'
import oAuthRouter from './routes/oAuth.routes'
import mediasRouter from './routes/medias.routes'
import { initUploadsTempFolder } from './utils/file'
import { getEnv } from './utils/config.env'
import PATHS from './constants/paths'
import staticRouter from './routes/static.routes'
import cors from 'cors'

const app = express()
const PORT = getEnv.PORT as string | 4000

//create folder uploads
initUploadsTempFolder()

app.use(express.json()) //middleware to parse json to object
app.use(cors())

//routes
app.get('/', (req, res) => {
  res.status(200)
  res.send('Hello World!')
})

//using routes handler
app.use('/users', usersRouter) //has to be /user/profile
app.use('/api', oAuthRouter)
app.use('/medias', mediasRouter)

//serve static files
// app.use(express.static(PATHS.UPLOADS_IMAGE))
//=> http://localhost:4000/aa3ed3b0dc3a9566305aa3600.jpeg
// app.use(PATHS.PREFIX_MEDIA, express.static(PATHS.UPLOADS_IMAGE))
//=> http://localhost:4000/medias/aa3ed3b0dc3a9566305aa3600.jpeg
app.use(`${PATHS.PREFIX_MEDIA}${PATHS.SERVE_VIDEOS}`, express.static(PATHS.UPLOADS_VIDEO)) //serve video not stream
app.use(PATHS.PREFIX_MEDIA, staticRouter) // have serve video stream, demo video stream in client side (Home.tsx)

//run mongoDB
databaseService.connect().catch(console.dir)

//app error handler
//level higher than routes in app
app.use(appErrorHandler)

//start the server
app.listen(PORT, () => console.log(`App listening on port: ${PORT}`))
