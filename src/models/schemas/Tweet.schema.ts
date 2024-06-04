import { ObjectId } from 'mongodb'
import { Media } from '../Other'
import { TweetAudience, TweetType } from '~/constants/enum'

interface TweetProps {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  create_at?: Date
  update_at?: Date
}

export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  create_at: Date
  update_at: Date
  constructor({
    _id,
    user_id,
    type,
    audience,
    content,
    parent_id,
    hashtags,
    mentions,
    medias,
    guest_views,
    user_views,
    create_at,
    update_at
  }: TweetProps) {
    const currentDate = new Date()
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.type = type
    this.audience = audience
    this.content = content
    this.parent_id = parent_id
    this.hashtags = hashtags
    this.mentions = mentions
    this.medias = medias
    this.guest_views = guest_views
    this.user_views = user_views
    this.create_at = create_at || currentDate
    this.update_at = update_at || currentDate
  }
}
