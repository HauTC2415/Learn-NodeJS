import { TweetRequestBody } from '~/models/requests/Tweet.request'
import databaseService from './database.services'
import Tweet from '~/models/schemas/Tweet.schema'
import { ObjectId, WithId } from 'mongodb'
import Hashtag from '~/models/schemas/Hashtag.schema'

class TweetService {
  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagDocument = await Promise.all(
      hashtags.map((hashtag) => {
        //find hashtag in database
        //if not exist, create new hashtag
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtag({ name: hashtag }) },
          { upsert: true, returnDocument: 'after' }
        )
      })
    )
    return hashtagDocument.map((hashtag) => (hashtag as WithId<Hashtag>)._id)
  }

  async createTweet({ user_id, body }: { user_id: string; body: TweetRequestBody }) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags)
    const tweet = new Tweet({
      user_id: new ObjectId(user_id),
      type: body.type,
      audience: body.audience,
      content: body.content,
      parent_id: body.parent_id,
      hashtags,
      mentions: body.mentions,
      medias: body.medias
    })
    const rs = await databaseService.tweets.insertOne(tweet)
    return rs
  }
}
const tweetService = new TweetService()
export default tweetService
