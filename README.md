# FacereQuod — To-Do Web Application

A small server-rendered to-do list app built with Node.js, Express, EJS and MongoDB. The home page shows today's list, titled with the current date. Any URL path (for example `/work` or `/groceries`) creates its own separate list. Tasks are stored in MongoDB, so they persist between visits.

## Features

- **Daily list** on `/`, titled with today's date (e.g. "Monday, March 14").
- **Custom lists** created on the fly from the URL: visiting `/work` creates a list named `Work`. Names are capitalized with lodash.
- **Add tasks** with the input field and the `+` button. Empty input is ignored.
- **Delete tasks** by ticking their checkbox.
- **Starter content**: when the main list is empty, three welcome tasks are added automatically.
- Server-rendered views (EJS + Bootstrap 3). There is no client-side JavaScript framework.

## Tech stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Runtime   | Node.js (`engines` pins `16.13.1`)    |
| Server    | Express 4, body-parser                |
| Views     | EJS templates, Bootstrap 3.3.7 (CDN)  |
| Database  | MongoDB through Mongoose 6            |
| Utilities | lodash                                |
| Hosting   | `Procfile` for Heroku-style platforms |

## Prerequisites

- [Node.js](https://nodejs.org/) 16.x and npm
- A MongoDB database: a local `mongod` instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- Optional: [nodemon](https://nodemon.io/) for the `dev` script. It is not listed in `package.json`, so install it globally or run it with `npx`.

## Getting started

```bash
git clone https://github.com/nkelava/to-do-web-app.git
cd to-do-web-app
npm install
```

### Point the app at your database

The MongoDB connection string is **hardcoded** in `src/app.js`. It is not read from an environment variable. Before you run the app, replace the URI passed to `mongoose.connect` with your own:

```js
// src/app.js
mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true });
```

For Atlas, use your cluster's `mongodb+srv://<user>:<password>@<cluster>/todoDB` string. If you need to keep credentials out of the code, you can change the line to read `process.env.MONGODB_URI` yourself. The current code does not do this.

### Run

```bash
npm start          # node src/app.js
npm run dev        # nodemon src/app.js (auto-restart on changes)
```

Then open <http://localhost:3000>.

## Configuration

| Variable | Default | Description                     |
| -------- | ------- | ------------------------------- |
| `PORT`   | `3000`  | Port the Express server uses. |

`PORT` is the only environment variable the code reads. The database URI is set in `src/app.js`, as described above.

## Usage

| Route              | Method | What it does                                                                           |
| ------------------ | ------ | -------------------------------------------------------------------------------------- |
| `/`                | GET    | Shows today's list and seeds the welcome tasks if the list is empty.                   |
| `/`                | POST   | Adds a task (`newItemName`) to the list named in `listName`, then redirects back.      |
| `/:customListName` | GET    | Opens the custom list with that name and creates it first if it doesn't exist.         |
| `/delete`          | POST   | Removes the task whose id is sent as `checkbox` from the list named in `listName`.     |

Examples:

1. Open `http://localhost:3000/` and add a few tasks for today.
2. Open `http://localhost:3000/work` to start a separate "Work" list.
3. Tick a task's checkbox to delete it.

Data model (Mongoose):

- `Item` — `{ name: String }`, used for the main daily list.
- `List` — `{ name: String, items: [Item] }`, one document per custom list.

## Project structure

```text
to-do-web-app/
├── src/
│   └── app.js            # Express server: DB connection, models, routes
├── modules/
│   └── date.js           # Date helpers (getDate, getDay, getMonth, getYear)
├── views/
│   ├── home.ejs          # Main page; assembles the partials below
│   └── partials/
│       ├── header.ejs    # <head>, Bootstrap/CSS links, opens the page container
│       ├── navbar.ejs    # Top navigation bar
│       ├── list.ejs      # List title, task items, add-task form
│       └── footer.ejs    # Footer and closing tags
├── public/
│   └── css/styles.css    # App styles (served statically)
├── index.html            # Empty placeholder page, not used by the server
├── Procfile              # Process definition for Heroku-style hosting (web: node src/app.js)
└── package.json          # Dependencies and npm scripts
```

## Deployment

The `Procfile` (`web: node src/app.js`) works on Heroku and compatible platforms. The platform sets `PORT` automatically. Make sure the connection string in `src/app.js` points to a database the host can reach, such as MongoDB Atlas.

## Known limitations

- **Custom list pages fail to render.** The `/:customListName` route renders a `list` view, but `views/list.ejs` doesn't exist. Only `views/partials/list.ejs` does. The list is still created in the database. To fix this, add a `views/list.ejs` that includes the header, list and footer partials, like `home.ejs` does.
- **Hardcoded database URI.** The database connection string, including its credentials, is committed in `src/app.js`. It should be moved to an environment variable.
- **The date is fixed at startup.** `modules/date.js` computes the date once, when the server starts. A long-running process keeps showing the start-up date until it restarts.
- No automated tests yet. `npm test` is the default placeholder.

## Author

Nikola Kelava. The package is published under the ISC license, as declared in `package.json`.
