import { config } from 'dotenv'
import minimist from 'minimist'

config()

export const isProduction = !minimist(process.argv.slice(2)).development_env

class AppEnvironment {
  private env = process.env
  get getEnv() {
    return this.env
  }

  get getHost() {
    const host = isProduction ? this.env.HOST : `${this.env.HOST_DEV}:${this.env.PORT}`
    return host as string
  }
}
const getEnv = new AppEnvironment().getEnv
const getHost = new AppEnvironment().getHost

export { getHost, getEnv }
