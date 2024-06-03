import { MongoClient, Db, Collection } from 'mongodb'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follow from '~/models/schemas/Follower.schema'
import { getEnv } from '~/utils/config.env'
import VideoStatus from '~/models/schemas/VideoStatus.schema'

const uri = `mongodb+srv://${getEnv.DB_USERNAME}:${getEnv.BD_PASSWORD}@twitter.wtyiuov.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true
//   }
// })

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client ??= new MongoClient(uri)
    this.db = this.client.db(getEnv.DB_NAME)
  }

  async connect() {
    try {
      //get instance db
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error occurred while connecting to MongoDB', error)
    }
  }

  async disconnect() {
    if (!this.client) return
    console.log('disconnecting')
    await this.client.close()
    console.log('disconnected')
  }

  createIndexesUsers() {
    this.users.createIndex({ email: 1 }, { unique: true })
    this.users.createIndex({ username: 1 }, { unique: true })
    this.users.createIndex({ username: 1, password: 1 })
  }

  //get collection users
  get users(): Collection<User> {
    return this.db.collection(getEnv.DB_USERS_COLLECTION as string)
  }
  //get collection refreshTokens
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(getEnv.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  //get collection followers
  get followers(): Collection<Follow> {
    return this.db.collection(getEnv.DB_FOLLOWERS_COLLECTION as string)
  }

  //get collection videoStatus
  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(getEnv.DB_VIDEO_STATUS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
