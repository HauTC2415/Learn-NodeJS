import { TweetAudience, TweetType } from '~/constants/enum'
import { Media } from '../Other'

export interface TweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //null when root tweet, string when reply with tweet_id string
  hashtags: string[] //name of hashtags ['React', 'MAUI', 'Xamarin']
  mentions: string[] //user_id of mentioned users ['user_id1', 'user_id2']
  medias: Media[]
}
