import express from 'express';
import * as qs from "node:querystring";
import { crud } from "./server.crud.js";
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;
let responseData = []
let chunks = []

const USERS_URL = './server/BBDD/users.json'
const CIRCUITS_URL = './server/BBDD/circuits.json'
const ARTICLES_URL = './server/BBDD/articles.json'
const EVENTS_URL = './server/BBDD/events.json'
const FORUM_TOPICS_URL = './server/BBDD/forum.topics.json'

app.use(express.static('../PFBNeoland/src'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



 //USERS============
app.post('/create/user', (req, res) => {
    crud.create(USERS_URL, req.body, (data) => {
        res.json(data)
      });
})

app.get('/read/users', (req, res) => {
    crud.read(USERS_URL, (data) => {
        res.json(data)
      });
});


app.put('/update/user/:id', (req, res) => {
    crud.update(USERS_URL, req.params.id, req.body, (data) => {
        res.json(data)
      });
});



//CIRCUITS=================
app.get('/read/circuits', (req, res) => {
    crud.read(CIRCUITS_URL, (data) => {
        res.json(data)
      });
});



//EVENTS=================
app.post('/create/event', (req, res) => {
    crud.create(EVENTS_URL, req.body, (data) => {
        res.json(data)
    });
})


app.get('/read/events', (req, res) => {
    crud.read(EVENTS_URL, (data) => {
        res.json(data)
      });
}); 

app.delete('/delete/event/:id',  (req, res) => {
    crud.delete(EVENTS_URL, req.params.id, (data) => {
     res.json(data)
   });
 })

//MARKET=================
app.post('/create/article', (req, res) => {
    crud.create(ARTICLES_URL, req.body, (data) => {
        res.json(data)
    });
})


app.get('/read/articles', (req, res) => {
    crud.read(ARTICLES_URL, (data) => {
        res.json(data)
      });
});

app.delete('/delete/article/:id',  (req, res) => {
     crud.delete(ARTICLES_URL, req.params.id, (data) => {
      res.json(data)
    });
  })


//FORUM TODO===================
app.get('/read/forum-topics', (req, res) => {
    crud.read(FORUM_TOPICS_URL, (data) => {
        res.json(data)
      });
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})