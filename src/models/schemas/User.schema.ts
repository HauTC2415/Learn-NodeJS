import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  password: string
  date_of_birth: Date
  created_at?: Date
  updated_at?: Date
  verify_status?: UserVerifyStatus
  email_verify_token?: string
  forgot_password_token?: string
  //optional fields
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export default class User {
  _id?: ObjectId //mongoDB id auto created
  name: string
  email: string
  password: string
  date_of_birth: Date
  created_at: Date
  updated_at: Date
  verify_status: UserVerifyStatus
  email_verify_token: string
  forgot_password_token: string
  //optional fields
  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string

  constructor(user: UserType) {
    const data = new Date()
    this._id = user._id
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.date_of_birth = user.date_of_birth
    this.created_at = user.created_at || data
    this.updated_at = user.updated_at || data
    this.verify_status = user.verify_status || UserVerifyStatus.UNVERIFIED
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    //optional fields
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
  }
}
