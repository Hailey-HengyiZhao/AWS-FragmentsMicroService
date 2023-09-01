# Introduction
Fragment Microservice Version 3 is a highly scalable microservice designed to work with fragments of text and images. The microservice is continuously being developed and improved. This document aims to analyze the current components that have been built and introduce their functions.

## Content-Type
The microservice presently offers support for a range of ‘Content-Type’ formats:
```
text/plain
text/markdown
text/html
application/json
image/jpg
image/png
image/gif
image/webp
```
In this version, there's an added capability for converting between different image types, determined by the extension the user provides. Additionally, it facilitates the conversion from 'text/markdown' to 'text/html'. As an example, if the file extension is ‘.md’, the fragment will be returned as ‘text/markdown’. However, if the fragment is designated with a ‘Content-Type’ of ‘text/markdown’, it will be automatically converted to ‘text/html’ upon retrieval.

As a result, it is capable of effectively handling and processing these formats.


## Authentication
Most of the API routes within the microservice require authentication. Authenticated users are granted access to these routes. The authentication mechanism is implemented using AWS Cognito, which provides sign-up and sign-in features for the application. Upon successful authentication, users are provided with JSON Web Tokens (JWTs) for identification. 

## API Routes Control
To manage different versions of the API, the web application uses versioning in its routes. The current version is denoted by ‘/v1/’ in all relative routes. 

The Fragment Microservice provides the following API routes: 

### GET /v1/fragment

Retrieves fragments ID list of the authenticated user. An optional query parameter, ‘expand=1’ can be used to retrieve the detailed list of fragment data for the authenticated user.


### GET /v1/fragment/:id
Retrieves specific fragment data based on its unique identifier. The route with 'id.ext' retrieves the fragment data with the provided extension. 

### GET /v1/fragment/:id/info
Retrieves metadata information for a specific fragment identified by its unique identifier.

### POST /v1/fragment
Allows authenticated users to create new fragments.

### PUT /v1/fragment/:id
Allows authenticated users to update an existing fragment. If the fragment is not found, the server will return a 404 error code.

### DELETE /v1/fragment/:id
Allows authenticated users to delete an existing fragment. If the fragment is not found, the server will return a 404 error code.


## Usage

To run the server: ```npm start```

To run the server with nodemon
```npm run dev```


To run all unit tests: 
```npn run test```

To run all hurl integration tests: 
```npm run test:integration```

To connect to debugger and run the server: 
```npm run debug```

To run ESLint: 
```npm run lint```

To test the coverage of Unit testing:
```npm run coverage```

## Versions Control
### Version 3

The server has expanded its range of acceptable Content-Types to encompass all image content types
```
‘text/plain’, ‘text/markdown’, ‘text/html’, ‘application/json’
 ‘image/jpg’, ‘image/png’, ‘image/gif’, ‘image/webp’
```
This version also enables the conversion between different image types based on the extension the user provides. 

Furthermore, improvements have been made to the routes ‘PUT /v1/fragments/:id’ and ‘DELETE /v1/fragments/:id’, signifying that the server now facilitates fragment modification and deletion. 

In the recent update to our system architecture, significant modifications were made to the data storage mechanisms of our fragment server. As part of these enhancements, we have strategically allocated the storage of metadata to Amazon S3, leveraging its scalability and durability for such data types. Concurrently, the primary data is now being securely stored in Amazon DynamoDB, benefiting from its high availability and performance capabilities. This bifurcation not only streamlines our data management processes but also optimizes the system for better performance and reliability.


### Version 2 

The server introduces enhanced functionality. The fragment updated to accept various ‘Content-Type’ formats such as ‘text/markdown’, ‘text/html’, ‘application/json’.
 Additionally, a new route, ‘Get /v1/fragments/:id/info’, has been added to the file. Furthermore, the ‘GET /v1/fragments/:id’ route now accepts the id with an extension. Moreover, Version 2 incorporates docker image capabilities for improved support. All images related to ‘fragments’ and ‘fragments-ui’ can be found in the Docker Hub Repository under the username ‘cchoney233233’. Lastly, the Fragment Server has enhanced the CD pipeline checks for improved reliability.

