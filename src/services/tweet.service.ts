import { TweetRequestBody } from '~/models/requests/Tweet.request'
import databaseService from './database.services'
import Tweet from '~/models/schemas/Tweet.schema'
import { ObjectId } from 'mongodb'

class TweetService {
  async createTweet({ user_id, body }: { user_id: string; body: TweetRequestBody }) {
    const tweet = new Tweet({
      user_id: new ObjectId(user_id),
      type: body.type,
      audience: body.audience,
      content: body.content,
      parent_id: body.parent_id,
      hashtags: [], // TODO: Implement hashtags
      mentions: body.mentions,
      medias: body.medias
    })
    const rs = await databaseService.tweets.insertOne(tweet)
    return rs
  }
}
const tweetService = new TweetService()
export default tweetService
