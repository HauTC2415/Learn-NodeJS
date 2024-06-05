import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEET_MESSAGES } from '~/constants/message'
import { DefaultError } from '~/models/Errors'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'

const tweetTypes = numberEnumToArray(TweetType)
const audienceTypes = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(MediaType)

export const createTweetValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes],
          errorMessage: TWEET_MESSAGES.TWEET_INVALID
        }
      },
      audience: {
        isIn: {
          options: [audienceTypes],
          errorMessage: TWEET_MESSAGES.AUDIENCE_INVALID
        }
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            //if type does not root tweet, parent_id must be a valid tweet id
            const parentIdInvalid =
              [TweetType.Comment, TweetType.Retweet, TweetType.QuoteTweet].includes(type) && !ObjectId.isValid(value)
            if (parentIdInvalid) {
              throw new DefaultError({
                message: TWEET_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            //if type is root tweet, parent_id must be null
            if (type === TweetType.Tweet && value) {
              throw new DefaultError({
                message: TWEET_MESSAGES.PARENT_ID_MUST_BE_NULL,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      content: {
        isString: {
          errorMessage: TWEET_MESSAGES.CONTENT_INVALID_MUST_BE_STRING
        },
        custom: {
          options: (value: string, { req }) => {
            const type = req.body.type as TweetType
            const hashtags = req.body.hashtags as string[]
            const mentions = req.body.mentions as string[]
            //if type is retweet, content must be empty
            const invalid = [TweetType.Retweet].includes(type) && value === ''
            if (invalid) {
              throw new DefaultError({
                message: TWEET_MESSAGES.CONTENT_MUST_BE_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            //if type is not retweet && hashtags and mentions empty, content must be not empty
            const contentEmptyAndMoreCondition =
              value !== '' && type !== TweetType.Retweet && isEmpty(mentions) && isEmpty(hashtags)
            if (contentEmptyAndMoreCondition) {
              throw new DefaultError({
                message: TWEET_MESSAGES.CONTENT_IS_REQUIRED_OR_MUST_BE_STRING,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      hashtags: {
        isArray: {
          errorMessage: TWEET_MESSAGES.HASHTAGS_MUST_BE_ARRAY
        },
        custom: {
          options: (value: string[], { req }) => {
            const invalid = value.some((hashtag) => typeof hashtag !== 'string')
            if (invalid) {
              throw new DefaultError({
                message: TWEET_MESSAGES.HASHTAGS_MUST_BE_ARRAY_STRING,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      mentions: {
        isArray: {
          errorMessage: TWEET_MESSAGES.MENTIONS_MUST_BE_ARRAY
        },
        custom: {
          options: (value: string[], { req }) => {
            const invalid = value.some((mention) => !ObjectId.isValid(mention))
            if (invalid) {
              throw new DefaultError({
                message: TWEET_MESSAGES.MENTIONS_MUST_BE_ARRAY_OF_USER_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      medias: {
        isArray: {
          errorMessage: TWEET_MESSAGES.MEDIAS_MUST_BE_ARRAY
        },
        custom: {
          options: (value: string[], { req }) => {
            const invalid = value.some((item: any) => {
              //must be object with url and type
              return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
            })
            if (invalid) {
              throw new DefaultError({
                message: TWEET_MESSAGES.MEDIAS_MUST_BE_ARRAY_OF_MEDIA_TYPE,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
