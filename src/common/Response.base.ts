class ResponseBase<T> {
  message: string
  data: T
  constructor(message: string, data: T) {
    this.message = message
    this.data = data
  }
}
export default ResponseBase
