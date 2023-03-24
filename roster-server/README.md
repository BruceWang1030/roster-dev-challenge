# Node.js MongoDB Backend

This is a simple API built using Express, Mongoose and Cors. It allows you to perform basic CRUD (Create, Read, Update, Delete) operations on artists.

## Requirements

- Node.js
- MongoDB

## Installation

1. Clone this repository
2. Install dependencies by running `npm install`
3. Create a `.env` file in the root directory and add your MongoDB connection string like so: `MONGODB_CONNECTION=<your-connection-string>`
4. Start the server by running `npm start`

## Usage

### Retrieving all artists

Make a GET request to `/artists` to retrieve all artists.

### Creating a new artist

Make a POST request to `/artists` with the following request body:

```json
{
  "artist": "Artist name",
  "rate": 10,
  "streams": 10000
}
```

### Updating an artist

Make a PUT request to `/artists/:id` with the ID of the artist you wish to update and the following request body:

```json
{
  "artist": "New artist name",
  "rate": 5,
  "streams": 5000,
  "payoutComplet": true
}
```

### Deleting an artist

Make a DELETE request to `/artists/:id` with the ID of the artist you wish to delete.
