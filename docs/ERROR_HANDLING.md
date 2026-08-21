# Error Handling

## Standard Error Response Format
```json
{
  "success": false,
  "message": "Human readable error message",
  "code": "ERROR_CODE",
  "errors": []
}
```

## Standard Success Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

## Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request body/query validation failed |
| INVALID_CREDENTIALS | 401 | Wrong email or password |
| TOKEN_EXPIRED | 401 | JWT has expired |
| TOKEN_INVALID | 401 | JWT is malformed or invalid |
| UNAUTHORIZED | 401 | No token provided |
| FORBIDDEN | 403 | Insufficient role/permissions |
| NOT_FOUND | 404 | Requested resource not found |
| CONFLICT | 409 | Duplicate resource (e.g., email already exists) |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Unhandled server error |

## Implementation
- Centralized error handler middleware at the end of the Express middleware chain.
- Custom `AppError` class with `statusCode`, `code`, and `message`.
- Services throw `AppError` instances; controller/middleware catches and formats response.
- Stack traces only logged server-side, never sent to client in production.
