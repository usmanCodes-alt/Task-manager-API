# Task-manager-API
This CRUD REST API works around two schemas, the user schema and the task schema, which are modularized into their respective files.
The API has multiple endpoints for users and tasks, tasks are related to users by comprising of a ownerId in their schema.
Every route requires authentication and authorization using jsonwebtokens (jwt). The middleware (authentication.js file) runs before the user is intended to
perform any operation and actually make sure the user is authenticated properly.
Once the user is logged in or signed up, they are provided with a jwt token, with that token they are perform CRUD operations on their profile
as well as the tasks that they have made.
