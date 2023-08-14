# tests/integration/post-fragments-unsupported-type.hurl

# Unsupported-type POST to /v1/fragments

POST http://localhost:8080/v1/fragments
# We're sending a jpge image fragment
Content-Type: no/type
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a unsupported-type fragments`

# 1. We expect to get back an HTTP 415
HTTP/1.1 415
