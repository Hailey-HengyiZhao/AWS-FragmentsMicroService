# tests/integration/post-fragments-unauthenticated.hurl

# Unauthenticated POST to /v1/fragments

POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: image/jpeg
# Include HTTP Basic Auth credentials
[BasicAuth]
unauthenticatedUser@email.com:wrongPassword
# Body of the request goes in ```...``` when it's a string
`This is a unauthenticated user`

# 1. We expect to get back an HTTP 415
HTTP/1.1 401
