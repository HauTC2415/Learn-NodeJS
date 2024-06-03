type LogProps = {
  msg: any
  foreground?: string
  background?: string
}

enum COLOR_STRING {
  red = 'red',
  green = 'green',
  yellow = 'yellow',
  blue = 'blue',
  purple = 'purple',
  cyan = 'cyan'
}

type ColorCodesType = {
  red: string
  green: string
  yellow: string
  blue: string
  purple: string
  cyan: string
}

function LogCommon({ msg, foreground = '', background = '' }: LogProps) {
  const PfxCodVar = '\u001b[1;'
  const ClrCodVar = '\u001b[0m'
  const ColorCodes: ColorCodesType = {
    red: '1',
    green: '2',
    yellow: '3',
    blue: '4',
    purple: '5',
    cyan: '6'
  }

  let foregroundString = ''
  let backgroundString = ''
  const foregroundCode = ColorCodes[foreground as keyof typeof ColorCodes]
  const backgroundCode = ColorCodes[background as keyof typeof ColorCodes]

  if (foreground && foregroundCode) {
    foregroundString = PfxCodVar + '3' + foregroundCode + 'm'
  }
  if (background && backgroundCode) {
    backgroundString = PfxCodVar + '4' + backgroundCode + 'm'
  }

  const logDate = new Date().toLocaleString()
  const startLog = '>>>>>>>>>> S T A R T _ L O G >>>>>>>>>>'
  const endLog = '>>>>>>>>>> E N D _ L O G >>>>>>>>>>'
  const logMsg = `LOG_DATE: ${logDate}\n  MESSAGE: ${msg}`
  const foreString = COLOR_STRING.cyan
  const foreCode = ColorCodes[foreString as keyof typeof ColorCodes]
  const foregroundStringLog = PfxCodVar + '3' + foreCode + 'm'
  console.log(foregroundStringLog, backgroundString, startLog, ClrCodVar)
  console.log(foregroundString, backgroundString, logMsg, ClrCodVar)
  console.log(foregroundStringLog, backgroundString, endLog, ClrCodVar)
}

export const LogError = (msg: any) => {
  LogCommon({ msg, foreground: COLOR_STRING.red })
}

export const LogWarning = (msg: any) => {
  LogCommon({ msg, foreground: COLOR_STRING.yellow })
}

export const LogInfo = (msg: any) => {
  LogCommon({ msg, foreground: COLOR_STRING.green })
}
