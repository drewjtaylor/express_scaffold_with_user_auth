# This is a node/express server with support for user authentication scaffolded out already.


Steps before using for a different project:

Update package.json title and description

edit config.js to have your database name in the end of "mongoUrl" and as "mongoDbName" (currently "startupdb")

Also in config.js, change 'secretKey' to be any long random string

Add config.js to gitignore

use OpenSSL to create "server.cert" and "server.key" using the following command:

`openssl req -nodes -new -x509 -keyout server.key -out server.cert`

Add these files to "bin" folder 

Scrap or reconfigure the "eventsRouter" in "routes" and "Event.js" in "models" (currently has functionality to require user auth for certain things, post things, etc.)




To use:

run "deploy.sh" to boot up the mongo server in a terminal

run "npm start" in another terminal to keep the server running as you make changes.

test out your work with postman/insomnia/your working front-end


An admin user will need to be manually created in mongoDB to use any routes that require such privelages.


1. [Current Routes](#routes)
2. [Authentication](#authentication)

# <a name="routes">Routes</a>

## /users
GET: Will retrieve all users (Requires admin to be signed in)

DELETE: Will clear all users (Requires admin to be signed in)

PUT: Will not have any functionality at this endpoint

POST: Used to regiser a new user by including a JSON body. The JSON body should include an email and username that hasn't been used before, a password, and an optional firstName and lastName field, such as the following:
```
{
    "email": "testemail1@example.com",
    "username": "notadmin",
    "password": "password",
    "firstName": "Joe",
    "lastName": "Schmoe"
}
```

## users/:userId

By adding the _id for the user in question to the url (i.e., https://localhost:3443/users/bigLongUser_IdHere), CRUD operations can be performed. All of these require a bearer token from an Admin.

GET: Retrieve information for specific user

DELETE: Delete a specific user

PUT: Will edit an existing user’s information, updating any fields included in the JSON body of the request.

## /events
GET: Will retrieve all events from database. (Ignore the highlighted event times for now. Just note that multiple events are returned.)



If the body of the request has a startDate (in JSON format) but no endDate, all events for that day are returned.

If the body of the request has a startDate and endDate, all events on or between those dates will be returned.


DELETE: Clear all events from database
Requires bearer token from an Admin to be present.

POST: Create a new event
Requires a bearer token from a valid user. Does not require that user to be an admin.

The body must contain a name, description, and eventDate in JSON format. The eventDate must be a string that can be fed into <code>new Date(eventdate)</code> to create a valid javascript Date object.

## /events/:eventId
GET: Will retrieve information for the event with an _id of eventId

DELETE: Will delete a specific event. Requires a bearer token from either the creator of the event, or from an admin user.

PUT: Will edit an existing event. Also requires a bearer token from the creator or an admin.

Requires a bearer token from either the creator of the event, or from an admin user.

# <a name='authentication'>Authentication</a>

When a user us successfully logged in, a token is returned.

This token can be copied and entered as a Bearer Token in the header (or automatically entered using Postman's "bearer" authentication method,) causing future requests to let the server know which user is making the request.

Here is an example of using the bearer token using Postman's bearer authentication

You can also add the header directly (this is all Postman was doing anyway). Make sure to add the header title "Authorization" with the value, "Bearer {token goes here}"
