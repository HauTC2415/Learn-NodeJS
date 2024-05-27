import { ObjectId } from 'mongodb'

interface FollowType {
  _id?: ObjectId
  user_id: ObjectId
  follower_user_id: ObjectId
  create_at?: Date
}

class Follow {
  _id?: ObjectId
  user_id: ObjectId
  follower_user_id: ObjectId
  create_at: Date
  constructor({ _id, user_id, follower_user_id, create_at }: FollowType) {
    this._id = _id
    this.user_id = user_id
    this.follower_user_id = follower_user_id
    this.create_at = create_at || new Date()
  }
}

export default Follow
