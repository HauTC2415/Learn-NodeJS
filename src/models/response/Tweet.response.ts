import { TweetAudience, TweetType } from '~/constants/enum'

export interface TweetResponse {
  tweet_id: string
  user_id: string
  type: TweetType
  audience: TweetAudience
}
