import { config } from 'dotenv'

config()

class ConfigEnv {
  readonly configEnv = process.env
}

const configEnv = new ConfigEnv().configEnv
export default configEnv
