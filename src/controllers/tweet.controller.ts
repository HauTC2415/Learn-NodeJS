import { RequestBodyBase } from '~/common/Request.base'
import { TweetRequestBody } from '~/models/requests/Tweet.request'
import { NextFunction, Response } from 'express'
import ResponseBase from '~/common/Response.base'
import { TWEET_MESSAGES } from '~/constants/message'
import CreateTweetResponse from '~/models/response/Tweet.reponse'

export const createTweetController = async (
  req: RequestBodyBase<TweetRequestBody>,
  res: Response,
  next: NextFunction
) => {
  return res.status(200).json(new ResponseBase<CreateTweetResponse>(TWEET_MESSAGES.CREATE_TWEET_SUCCESS, req.body))
}
