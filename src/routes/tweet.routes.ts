import { Router } from 'express'
import { createTweetController } from '~/controllers/tweet.controller'
import { createTweetValidator } from '~/middlewares/tweet.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetRouter = Router()

/**
 * Description: Create a new tweet
 * Request: POST /tweets/create
 * Body: TweetRequestBody
 * Header: { Authentication: Bearer <AccessToken> }
 */

tweetRouter.post('/create', accessTokenValidator, createTweetValidator, wrapRequestHandler(createTweetController))
export default tweetRouter
