import { createHash } from 'crypto'

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex')
}

export function hashPassword(data: string): string {
  return sha256(data + process.env.SALT_HASH)
}
