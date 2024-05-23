import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  create_at?: Date
  token: string
  user_id: ObjectId
}

class RefreshToken {
  _id?: ObjectId
  create_at: Date
  token: string
  user_id: ObjectId
  constructor({ _id, token, create_at, user_id }: RefreshTokenType) {
    this._id = _id
    this.token = token
    this.create_at = create_at || new Date()
    this.user_id = user_id
  }
}
export default RefreshToken
