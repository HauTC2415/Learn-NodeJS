# Error Handling

Trong Expressjs có 2 loại handler

## Request handler

Nhận request từ client và trả về response.

Với mỗi request handler thì chúng ta sẽ có 3 tham số là `req`, `res`, `next`.

Nếu không dùng `next` thì không cần khai báo cũng được

```ts
app.get('/users', (req, res, next) => {
  // do something
  res.send('Hello world')
})
```

- Gọi `next()` để chuyển request sang **request handler** tiếp theo
- Gọi `next(err)` | `throw(...)` để chuyển request sang **error handler** tiếp theo

Khi xảy ra lỗi trong synchronous handler (`đồng bộ`) thì tự động sẽ được chuyển sang **error handler**

Khi xảy ra lỗi trong asynchronous handler (`bất đồng bộ`) thì `bắt buộc` phải gọi `next(err)` để chuyển sang **error handler**

## Error handler

Nhận error **TỪ** `request handler` và trả về response

Với mỗi error handler thì chúng ta bắt **buộc phải khai báo đủ có 4 tham số** là `err`, `req`, `res`, `next`.

Nếu chỉ khai báo **3 tham số** thì nó sẽ được coi là **request handler**

```ts
app.use((err, req, res, next) => {
  if (err) {
    // do something
    res.status(400).send('Error')
  }
})
```

## Flow nên làm

Tất cả các lỗi nên được đưa về hết một chỗ để xử lý và trả về cho người dùng.

Chúng ta gọi chỗ đó là **default error handler** và nó sẽ được đặt ở cấp độ app

## Format lỗi trả về cho người dùng

Chúng ta nên thống nhất format lỗi trả về cho người dùng

Lỗi thường

```ts
{
  message: string
  error_info?: any
}
```

Lỗi validation (UNPROCESSABLE_ENTITY: 422)

```ts
{
  message: string,
  errors: {
    [field: string]: {
      msg: string
      [key: string]: any
    }
  }
}
```

=> Lưu ý thêm: những `error` do hệ thông như undefine.toString(),... Thì k thể dùng JSON.stringify(errorr) để ra error info được vì thuộc tính `enumerable: false` (chi tiết có thể dùng `Object.getOwnPropertyDescriptor(error,"message")` để xem)

Khi đó:

```ts
res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    error_info: err
  })

  =>
  {
      "message": "Cannot read properties of undefined (reading 'toString')",
      "error_info": {}
  }

```

Như vậy thì error_info sẽ là obj rỗng. do `enumerable: false`. Nên cần đổi là `enumerable: true`

```ts
Object.getOwnPropertyNames(err).forEach((key) => {
  Object.defineProperty(err, key, { enumerable: true })
})

res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
  message: err.message,
  error_info: err //omit(err, 'stack'): don't show stack in res
})

==>
{
    "message": "Cannot read properties of undefined (reading 'toString')",
    "error_info": {
        "stack": "TypeError: Cannot read properties of undefined (reading 'toString')\n    at loginController (/Users/truongconghau/Documents/EduDuocDev/Learn-NodeJS/src/controllers/users.controllers.ts:11:8)\n    at /Users/truongconghau/Documents/EduDuocDev/Learn-NodeJS/src/utils/handlers.ts:40:13\n    at Layer.handle [as handle_request] (/Users/truongconghau/Documents/EduDuocDev/Learn-NodeJS/node_modules/express/lib/router/layer.js:95:5)\n    at next (/Users/truongconghau/Documents/EduDuocDev/Learn-NodeJS/node_modules/express/lib/router/route.js:149:13)\n    at /Users/truongconghau/Documents/EduDuocDev/Learn-NodeJS/src/utils/validation.ts:17:14\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)",
        "message": "Cannot read properties of undefined (reading 'toString')"
    }
}
```

=> `error_info` không còn là obj rỗng nữa
