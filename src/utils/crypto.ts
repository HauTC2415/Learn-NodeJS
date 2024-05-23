import { createHash } from 'crypto'
import configEnv from './config.env'

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

export function hashPassword(data: string): string {
  return sha256(data + configEnv.SALT_HASH)
}
