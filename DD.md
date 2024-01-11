# Birthday Card Generator

## Introduction
Birthday cards are a great way to express a person's
feeling to the ones they cherish, but sometimes we forget
to prepare one or can't afford one (mainly due to distance).
<br />
<br />
This simple web application provides a solution for those
occasions by letting users to prepare a thoughtful message
wrapped in a nice visual, their digital birthday card, to send
to their love ones.

## Requirements
- Users can login using their google account.
- Users can create new digital birthday card while logged in.
- Users can view digital birthday cards while not logged in through unique urls for those cards.

## High Level Design

![Design](graph.png)

### Authentication
Use Firebase Auth to handles user authentication.
This also enable popup sign in with Google, GitHub,
and others.

### Web client
A NextJS application to let user to sign in,
create, and share virtual birthday cards.
The web app will be hosted on Vercel as it
has first-class support for NextJS.

### Web API
NextJS also provides features to build
a public API with NextJS. For convenience
(and because request to this API is free
on Vercel),
use NextJS API to create a web api that
allows users to create/remove and fetch cards.
This can be extended to support additional
Create, Read, Update, and Delete (CRUD)
operations.

### Firebase cloud
For each card, user will need to specify the
recipient's name, birthday message, a signature
from the sender, and the unique link for that card. 
These information will be stored in a document in 
the `Cards` collection.

### React-Firebase-Hooks
An external library that makes integrating firebase
into the project easier with features like 
listener to get our user when a new user is created.

## Detailed design

### Create new cards
Ideally only authenticated users can create new cards
so they can edit and remove them. Also, it helps later on
when we need to enforce quota per user. (e.g. 100 cards total?).
A unique url will be attached to each card.
<br />
<br />
Firebase's cloud storage provides a simple way to store
and query data so we will use that to store information
about each card.

### View cards
Users can shard their unique cards links that will will
give access to a view-only version of those cards. 
