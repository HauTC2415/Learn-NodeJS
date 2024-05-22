import User from '~/models/schemas/User.schema'
import databaseService from './database.services'

class UsersService {
  async login(data: { email: string; password: string }) {
    const { email, password } = data
    if (email === 'admin' && password === 'admin') {
      return {
        message: 'User logged in'
      }
    }
    return {
      message: 'email or password is incorrect'
    }
  }

  async register(data: { email: string; password: string }) {
    const { email, password } = data
    const user = new User({ email, password })
    const rs = await databaseService.users.insertOne(user)
    return rs
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return user ? true : false
  }
}

const usersService = new UsersService()
export default usersService
