import { config } from 'dotenv'
import minimist from 'minimist'

config()

class ConfigEnv {
  readonly configEnv = process.env
}

const configEnv = new ConfigEnv().configEnv
export default configEnv

export const isProduction = !minimist(process.argv.slice(2)).development_env
