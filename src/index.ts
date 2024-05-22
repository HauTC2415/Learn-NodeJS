import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { appErrorHandler } from './utils/handlers'

const app = express()
const PORT = 4000

app.use(express.json()) //middleware to parse json to object

//routes
app.get('/', (req, res) => {
  res.status(200)
  res.send('Hello World!')
})

//using routes handler
app.use('/users', usersRouter) //has to be /user/profile

//run mongoDB
databaseService.connect().catch(console.dir)

//app error handler
//level higher than routes in app
app.use(appErrorHandler)

//start the server
app.listen(PORT, () => console.log(`App listening on port: ${PORT}`))
