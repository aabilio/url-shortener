# Simple Url shortener: Universal app with Node.js and React

This is a simple universal app developed with Node (Express and Next.js) and React. There is a backend which is responsible for the first render of the frontend application and the simple url shortener HTTP API. This backend is also responsible for the url shortener gateway for the shorten urls.

| Desktop Screenshot | Mobile Screenshot  |
|---|---|
|  ![Desktop Screenshot](https://github.com/aabilio/url-shortener/raw/master/static/Screenshot_Desktop.png "Desktop Screenshot")  | ![Mobile Screenshot](https://github.com/aabilio/url-shortener/raw/master/static/Screenshot_mobile.png "Mobile Screenshot") |

There is a temporary online demo on https://url-shortener-aabilio.now.sh

### Backend

##### - API

This app has a little HTTP API that works on the top of an [Express server](https://github.com/aabilio/url-shortener/blob/master/server/server.js "Express server") with the next endpoints:

- **GET** */api/v1/destination/valid?url=:url* - Check if an url is valid
- **POST** */api/v1/url* - Short an url 
- **GET** */api/v1/url/:path* - Get url information by generated path
- **GET** */api/v1/url/:path/stats* - Get url stats by generated path
- **GET** */api/v1/url/:path/history* - Get url history by generated path
- **GET** */api/v1/urls* - Get last shortened urls

I tried to use a [kind of MVC](https://github.com/aabilio/url-shortener/tree/master/server "kind of MVC") ("V" are just a json responses) on backend part [with a service layer](https://github.com/aabilio/url-shortener/blob/master/server/utils/index.js "with a service layer") to keep the controllers as simple as possible.

##### - Gateway

This part of the app [just redirects the shorted urls to their destination](https://github.com/aabilio/url-shortener/blob/master/server/controllers/index.js#L29 "just redirects the shorted urls to their destination") (original url) but it also [created some stats](https://github.com/aabilio/url-shortener/blob/master/server/utils/index.js#L23 " created some stats") at the same time (ip, referrer, ...). The path is just <domain>/:path (path is the shorten url id)

##### - Server Side Rendering Part

This app also renders the first load off the React frontend app in the server. This is possible thanks to Next.js framework.

### Frontend

##### - React App

This app contains one [main Next.js page](https://github.com/aabilio/url-shortener/blob/master/pages/index.js "main Next.js page") (React Component) that handle all the [state and actions](https://github.com/aabilio/url-shortener/blob/master/pages/index.js#L17 "state and actions") of this simple application (we don't need Redux for this example) and a few of stateless components like Headers and Footers. Every component has its own style in jsx format.
The app was developed using ES6+ features and transpiling the code with Babel.

##### - Url Shortener api library

On the frontend part we also have a [simple library for the url shortener HTTP API](https://github.com/aabilio/url-shortener/blob/master/client-libs/url-shortener/index.js "simple library for the url shortener HTTP API") that implement all the API possible operations.

### Installation

1. Clone the repository
```bash
$ git clone https://github.com/aabilio/url-shortener.git
$ cd url-shortener
```

2. Install the dependencies
```bash
 $ npm install
```

3. Check the test and lint (we use the airbnb lint configuration)
```bash
 $ npm test
 $ npm run lint
```

4. You need a mysql database running (but it is easy to use another option). You need to provide the application the connection paramaters [editing app.js](https://github.com/aabilio/url-shortener/blob/master/app.js#L17 "editing app.js") (or setting properly the enviroment vars on your system):
```javascript
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'mysql'
const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost'
const DATABASE_NAME = process.env.DATABASE_NAME || 'url_shortener'
const DATABASE_USER = process.env.DATABASE_USER || 'root'
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'root'
```
By default, the app look for server running on **localhost**, with user and password "**root**" and the database name "**url_shortener**". You don' t need to create the database schema, the app just do it for you at the first start, you just need to create the databse and povide the app with the correct connection parameters.

5. Start dev server
```bash
$ npm run dev
```

Now the app is running on http://localhost:8000 and the api is running on http://localhost:8000/api/v1/ (ex.: http://localhost:8000/api/v1/urls)

### Deploying the app

You can easily prepare your app for production with
```bash
$ npm run build
$ npm export
```

[Temporary online demo](https://url-shortener-aabilio.now.sh "Temporary online demo") was deploying on [now](https://zeit.co/now "now") and the persistence layer is on [AWS RDS](https://aws.amazon.com/es/rds/ "AWS RDS") with a instance within the Free Tier.

### More

This app was developed with the dependency injection (through factory functions) and inversion of control patterns in mind (and DRY, KISS) to prepare the project for a better TDD process. Unit Tests were written with the Jest library.

Some other functional requirements and/or additional features could be implemented:

* **Stateless API Authentication** with Json Web Token as a Bearer Token using the Authentication Header from HTTP protocol.
* **API Pagination** for those endpoints that need it. Using url params like "limit" and "offset".
* **Multi domain support**. Now the generated shorten urls are not coupled with a certain domain so include new domains shouldn't be difficult.
* **Custom Path** (maybe for authenticated premium users). Refactorize short endpoint to accept new parameters and not just the url.
* **Shorting batch operations**. Refactoring the short endpoint's json body request payload we can include more urls than just one per call.
* **Control Panel** for the administration of the backend. Maybe another fronted application with React/Redux.
* We can gl deep on **browser test** to test the UX/UI.
* About the infrastructure, for example for the demo app, we can use **CI/CD, and Docker** or maybe use Amazon Elastic Beanstalk to deploy the app.

### Authors

* Abilio Almeida Eiroa ([@aabilio](https://twitter.com/aabilio "@aabilio"))