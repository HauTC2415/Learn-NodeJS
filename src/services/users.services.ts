import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'

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

  async register(data: RegisterRequestBody) {
    const user = new User({
      ...data,
      date_of_birth: new Date(data.date_of_birth),
      password: hashPassword(data.password)
    })
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
