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

  let foreStringGround = ''
  let backStringGround = ''
  const foregroundCode = ColorCodes[foreground as keyof typeof ColorCodes]
  const backgroundCode = ColorCodes[background as keyof typeof ColorCodes]

  if (foreground && foregroundCode) {
    foreStringGround = PfxCodVar + '3' + foregroundCode + 'm'
  }
  if (background && backgroundCode) {
    backStringGround = PfxCodVar + '4' + backgroundCode + 'm'
  }
  console.log(foreStringGround, backStringGround, msg, ClrCodVar)
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
