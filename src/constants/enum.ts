export enum UserVerifyStatus {
  UNVERIFIED,
  VERIFIED,
  BLOCKED
}

export enum TokenType {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  FORGOT_PASSWORD_TOKEN,
  VERIFY_EMAIL_TOKEN
}

export enum MediaType {
  IMAGE,
  VIDEO,
  VIDEO_HLS
}

export enum EncodingStatus {
  PENDING, //in queue
  PROCESSING, // in encoding
  COMPLETED, // encoding success
  FAILED // encoding failed,
}
