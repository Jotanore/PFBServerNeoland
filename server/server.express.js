import express from 'express';
import { crud } from "./server.crud.js";
import bodyParser from 'body-parser';
import {db} from './server.mongodb.js';
import { ObjectId } from 'mongodb';
import { gooogleOauth2 } from './server.oauth.js';

const app = express();
const port = process.env.PORT || 3000;

const USERS_URL = './server/BBDD/users.json'
const CIRCUITS_URL = './server/BBDD/circuits.json'
const ARTICLES_URL = './server/BBDD/articles.json'
const EVENTS_URL = './server/BBDD/events.json'
const FORUM_TOPICS_URL = './server/BBDD/forum.topics.json'

app.use(express.static('../PFBNeoland/src'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));



 //USERS============
app.post('/create/user', async (req, res) => {
    res.json(await db.users.create(req.body))
    // crud.create(USERS_URL, req.body, (data) => {
    //     res.json(data)
    //   });
})

app.get('/read/users', async (req, res) => {
    res.json(await db.users.get())
    // crud.read(USERS_URL, (data) => {
    //     res.json(data)
    //   });
});

app.get('/read/user/:id', async (req, res) => {
    res.json((await db.users.get({_id: new ObjectId(req.params.id)}))[0])
    // crud.read(USERS_URL, (data) => {
    //     res.json(data)
    //   });
});

app.put('/update/user/:id', async (req, res) => {
    res.json(await db.users.update(req.params.id, req.body))
    // crud.update(USERS_URL, req.params.id, req.body, (data) => {
    //     res.json(data)
    //   });
});

app.post('/login', async (req, res) => {
    const user = await db.users.logIn(req.body)
    if (user) {
      // TODO: use OAuth2
      // ...
      // Simulation of authentication (OAuth2)
      user.token = gooogleOauth2()
      // Remove password
      delete user.password
      res.json(user)
    } else {
      // Unauthorized
      res.status(401).send('Unauthorized')
    }
  })



//CIRCUITS=================
app.get('/read/circuits', async (req, res) => {
    res.json(await db.circuits.get())
    // crud.read(CIRCUITS_URL, (data) => {
    //     res.json(data)
    //   });
});

app.get('/read/circuit/:id', async (req, res) => {
    res.json((await db.circuits.get({_id: new ObjectId(req.params.id)}))[0])
    // crud.read(USERS_URL, (data) => {
    //     res.json(data)
    //   });
});


//EVENTS=================
app.post('/create/event', requireAuth, async (req, res) => {
    res.json(await db.events.create(req.body))
    // crud.create(EVENTS_URL, req.body, (data) => {
    //     res.json(data)
    // });
})


app.get('/read/events', async (req, res) => {
    res.json(await db.events.get())
    // crud.read(EVENTS_URL, (data) => {
    //     res.json(data)
    //   });
}); 

app.get('/read/events/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.events.get({user_id: userId}))
    // crud.read(EVENTS_URL, (data) => {
    //     res.json(data)
    //   });
}); 

app.delete('/delete/event/:id', async (req, res) => {
    res.json(await db.events.delete(req.params.id))
//     crud.delete(EVENTS_URL, req.params.id, (data) => {
//      res.json(data)
//    });
 })

//MARKET=================
app.post('/create/article', async (req, res) => {
    res.json(await db.market.create(req.body))
    // crud.create(ARTICLES_URL, req.body, (data) => {
    //     res.json(data)
    // });
})


app.get('/read/articles', async (req, res) => {
    res.json(await db.market.get())
    // crud.read(ARTICLES_URL, (data) => {
    //     res.json(data)
    //   });
});

app.get('/read/articles/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.market.get({user_id: userId}))
    // crud.read(ARTICLES_URL, (data) => {
    //     res.json(data)
    //   });
});

app.delete('/delete/article/:id', async (req, res) => {
    res.json(await db.market.delete(req.params.id))
    //  crud.delete(ARTICLES_URL, req.params.id, (data) => {
    //   res.json(data)
    // });
  })


//FORUM TODO===(or not, hehe)================
app.get('/read/forum-topics', (req, res) => {
    crud.read(FORUM_TOPICS_URL, (data) => {
        res.json(data)
      });
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

//RACELINES=============================

app.post('/create/raceline', async (req, res) => {
    res.json(await db.raceLines.create(req.body))
    // crud.create(ARTICLES_URL, req.body, (data) => {
    //     res.json(data)
    // });
})

app.get('/read/racelines', async (req, res) => {
    res.json(await db.raceLines.get())
    // crud.read(ARTICLES_URL, (data) => {
    //     res.json(data)
    //   });
});

app.get('/read/racelines/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.raceLines.get({user_id: userId}))
    // crud.read(ARTICLES_URL, (data) => {
    //     res.json(data)
    //   });
});

//========================================


function requireAuth(req, res, next) {
    // Simulation of authentication (OAuth2)
    if (req.headers.authorization === 'Bearer 123456') {
      next()
    } else {
      // Unauthorized
      res.status(401).send('Unauthorized')
    }
  }

