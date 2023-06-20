# Movies Recommendation Coding Exercise Application 🕺

>This is a React App frontend using TailwindCSS.
>React Testing Library/Jest for testing.
>Data Source provided as movies.json mocked endpoints using json-server

## Prerequisites
1. JSON-SERVER - npm install -g json-server (https://www.npmjs.com/package/json-server).
2. TailwindCSS - npm install -D tailwindcss / npx tailwindcss init [https://tailwindcss.com/docs/guides/create-react-app]

## React Client Application
1. cd recommend-movies (project directory)
2. npm i (install all required packages)
3. tab 1: json-server --watch movies.json --port 3030
4. tab 2: npm run start
5. tab 3: npm run test 
6. client application will start at <http://localhost:3000/>
7. json-server endpoints can be tested at <http://localhost:3030/movies> OR <http://localhost:3030/users>


## Deployment - Not Required
1. npm run build

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.