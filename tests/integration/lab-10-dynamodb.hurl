# tests/integration/lab-10-dynamodb.hurl

# Step 1: POST a new JSON fragment to the server.
POST http://localhost:8080/v1/fragments
# We're sending a JSON fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`{"service": "DynamoDB"}`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
fragment1_url: header "Location"
fragment1_id: header "Location" regex "http://localhost:8080/v1/fragments/([^/]+)"


# Step 2: GET the fragment you just created using the captured URL.
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

# 2. We expect to get back an HTTP 200
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString



# Step 3: POST a new Markdown fragment to the server.
POST http://localhost:8080/v1/fragments
# We're sending a Markdown fragment
Content-Type: text/markdown
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`DynamoDB is **great**.`

# 3. We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id: header "Location" regex "http://localhost:8080/v1/fragments/([^/]+)"


# Step 4: GET the fragment you just created using the captured URL.
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

# 4. We expect to get back an HTTP 200
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString

# 5. Get list of fragments by Authenticated GET to /v1/fragments
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

# 5. We expect to get back an HTTP 200
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.fragments[*]" includes {{fragment1_id}}
jsonpath "$.fragments[*]" includes {{fragment2_id}}

# Step 6: DELETE the first fragment using the captured fragment1 URL.
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 6. We expect to get back an HTTP 200
HTTP/1.1 200
Content-Type: application/json; charset=utf-8


# Step 7: GET the fragment you just created using the delete URL.
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

# 7. We expect to get back an HTTP 200
HTTP/1.1 404
Content-Type: application/json; charset=utf-8


# Step 8. Get list of fragments by Authenticated GET to /v1/fragments
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

# 8. We expect to get back an HTTP 200
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.fragments[*]" != {{fragment1_id}}
