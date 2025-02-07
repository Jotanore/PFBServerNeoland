// server.api.js
import * as http from "node:http";
import * as qs from "node:querystring";
import { crud } from "./server.crud.js";

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const USERS_URL = './server/BBDD/users.json'
const CIRCUITS_URL = './server/BBDD/circuits.json'
const ARTICLES_URL = './server/BBDD/articles.json'
const EVENTS_URL = './server/BBDD/events.json'
const FORUM_TOPICS_URL = './server/BBDD/forum.topics.json'

/**
 * Returns an object with the action name and id from the given pathname.
 * For example, for "/create/articles/:id", it will return { name: "/create/articles", id: ":id" }
 * @param {string} pathname
 * @returns {{name: string, id: string}}
 */
function getAction(pathname) {
  // /create/articles/:id
  const actionParts = pathname.split('/');
  return {
    name: `/${actionParts[1]}/${actionParts[2]}`,
    id: actionParts[3]
   }
}

http
  .createServer(async (request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const urlParams = Object.fromEntries(url.searchParams);
    const action = getAction(url.pathname);
    const statusCode = 200
    let responseData = []
    let chunks = []
    console.log(request.method, url.pathname, urlParams, action.name, action.id);
    // Set Up CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', MIME_TYPES.json);
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, DELETE, POST');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(statusCode);

    if (request.method === 'OPTIONS') {
      response.end();
      return;
    }

    switch (action.name) {
      case '/create/user':
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          // console.log('create article - body BUFFER', body)
          let parsedData = qs.parse(body.toString())
          // console.log('create article - body', parsedData)
          crud.create(USERS_URL, parsedData, (data) => {
            console.log(`server create user ${data.name} creado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;

        case '/read/users':
        crud.read(USERS_URL, (data) => {
          console.log('server read users', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        case '/update/user':
        console.log('UPDATE', action)
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          // console.log('update article - body BUFFER', body)
          let parsedData = qs.parse(body.toString())
          // console.log('update article - body', parsedData)
          crud.update(USERS_URL, action.id, parsedData, (data) => {
            console.log(`server update user ${action.id} modificado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;
        
        case '/read/circuits':
        crud.read(CIRCUITS_URL, (data) => {
          console.log('server read circuits', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        case '/create/event':
        crud.create(EVENTS_URL, urlParams, (data) => {
          console.log(`server ${data} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        case '/create/article':
        crud.create(ARTICLES_URL, urlParams, (data) => {
          console.log(`article ${data} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        // case '/create/articles':
        // crud.create(CIRCUITS_URL, url.Params, (data) => {
        //   console.log(`server ${data.name} creado`, data)
        //   responseData = data

        //   response.write(JSON.stringify(responseData));
        //   response.end();
        // });
        // break;

        case '/read/events':
        crud.read(EVENTS_URL, (data) => {
          console.log('server read events', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        case '/read/articles':
        crud.read(ARTICLES_URL, (data) => {
          console.log('server read events', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        case '/read/forum-topics':
        crud.read(FORUM_TOPICS_URL, (data) => {
          console.log('server read events', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/filter/articles':
        crud.filter(ARTICLES_URL, urlParams, (data) => {
          console.log('server filter articles', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;
        
      default:
        console.log('no se encontro el endpoint');

        response.write(JSON.stringify('no se encontro el endpoint'));
        response.end();
        break;
      }
  })
  .listen(process.env.API_PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.API_PORT + '/');