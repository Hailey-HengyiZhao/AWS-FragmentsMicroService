# tests/integration/lab-9-s3.hurl

# Step 1: POST a new text fragment to the server.
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`Hello S3!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"


# Step 2: GET the fragment you just created using the captured URL.
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 2. We expect to get back an HTTP 200
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "Hello S3!"

# Step 3: DELETE the fragment using the captured URL.
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# 3. We expect to get back an HTTP 200
HTTP/1.1 200

# Step 4: Try to GET the fragment again using the captured URL.
GET {{url}}
[BasicAuth]
user1@email.com:password1

# 4. We expect to get back an HTTP 404
HTTP/1.1 404