import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.BD_PASSWORD}@twitter.wtyiuov.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`
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
    console.log('new instance')
    this.client ??= new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
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
  }

  //get collection users
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
