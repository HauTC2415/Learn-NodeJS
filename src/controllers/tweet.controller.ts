import { RequestBodyBase } from '~/common/Request.base'
import { TweetRequestBody } from '~/models/requests/Tweet.request'
import { NextFunction, Response } from 'express'
import ResponseBase from '~/common/Response.base'
import { TWEET_MESSAGES } from '~/constants/message'
import tweetService from '~/services/tweet.service'
import { PayloadJwtToken } from '~/models/requests/User.requests'
import { TweetResponse } from '~/models/response/Tweet.response'

export const createTweetController = async (
  req: RequestBodyBase<TweetRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as PayloadJwtToken
  const result = await tweetService.createTweet({ user_id, body: req.body })
  const response: TweetResponse = {
    tweet_id: result.insertedId.toHexString(),
    audience: req.body.audience,
    type: req.body.type,
    user_id: user_id
  }
  return res.status(200).json(new ResponseBase<TweetResponse>(TWEET_MESSAGES.CREATE_TWEET_SUCCESS, response))
}
