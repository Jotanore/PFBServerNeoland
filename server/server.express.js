import express from 'express';
import { crud } from "./server.crud.js";
import bodyParser from 'body-parser';
import {db} from './server.mongodb.js';
import { ObjectId } from 'mongodb';
import { gooogleOauth2 } from './server.oauth.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('../PFBNeoland/src'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));



 //USERS============
app.post('/api/create/user', async (req, res) => {
    res.json(await db.users.create(req.body))
})

app.get('/api/read/users', async (req, res) => {
    res.json(await db.users.get())
});

app.get('/api/read/user/:id', async (req, res) => {
    res.json((await db.users.get({_id: new ObjectId(req.params.id)}))[0])
});

app.put('/api/update/user/:id', async (req, res) => {
    res.json(await db.users.update(req.params.id, req.body))
});

app.post('/api/login', async (req, res) => {
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

app.get('/api/read/circuits', async (req, res) => {

    let query = [];
    let filter = undefined

    if(req.headers.filters){
        const filters = JSON.parse(req.headers.filters)

        const circuitLocation = await db.circuits.getLocation()

        circuitLocation.forEach(function (circuit){
            const circuitCoords = [
                Number(circuit.location.latitude), 
                Number(circuit.location.longitude)
            ]

            const userCoords = [
                Number(filters.userCoords[0]),
                Number(filters.userCoords[1])
            ]

            const R = 6371; 
            // Destructure coords
            // const {latitude, longitude} = coordsObject
            // Does math
            const dLat = (circuitCoords[0] - userCoords[0]) * Math.PI / 180;
            const dLon = (circuitCoords[1] - userCoords[1]) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userCoords[0] * Math.PI / 180) * Math.cos(circuitCoords[0] * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            // Stores the distance fixing to 1 decimal
            const d = Math.round(R * c)

            if (Number(d) < Number(filters.distance)){
                
                query.push(circuit._id)
            }  

        })

        filter = { _id: {$in: query}}
    }
    res.json(await db.circuits.get(filter))

});

app.get('/api/read/circuit/:id', async (req, res) => {
    res.json((await db.circuits.get({_id: new ObjectId(req.params.id)}))[0])
});


//EVENTS=================
app.post('/api/create/event', requireAuth, async (req, res) => {
    res.json(await db.events.create(req.body))
})

app.post('/api/join/event/:eventid', requireAuth, async (req, res) => {

    const eventid = req.params.eventid;
    const userId = req.body.user_id;
    console.log(eventid,userId)


        const event = await db.events.getById({ _id: new ObjectId(eventid) }); 

        if (event.participants.length >= Number(event.maxParticipants)){
            return res.status(400).json({ message: "Este evento esta completo" });
        }
        if (!event.participants.includes(userId)) {
            event.participants.push(userId);
        } else {
            return res.status(400).json({ message: "Ya estás inscrito en este evento" });
        }

        await db.events.update( eventid, { participants: event.participants  });

        res.json({ message: "Usuario agregado al evento", event });

})

app.post('/api/forfeit/event/:eventid', requireAuth, async (req, res) => {

    const eventid = req.params.eventid;
    const userId = req.body.user_id;
    console.log(eventid,userId)
    const event = await db.events.getById({ _id: new ObjectId(eventid) });
    const update = await db.events.deleteParticipant(eventid, userId)
    res.json( { message: "Usuario fuera del evento", event })  
})



app.get('/api/read/events', async (req, res) => {

    let query = {};

    if(req.headers.filters){
        const filters = JSON.parse(req.headers.filters)

        if(filters.circuit && filters.circuit !== 'all'){
            query.location_id = filters.circuit
        }

        if (filters.minDate && filters.maxDate) {
            query.$expr = {
                $and: [
                    { $gte: [{ $toDate: "$date" }, new Date(filters.minDate)] },
                    { $lte: [{ $toDate: "$date" }, new Date(filters.maxDate)] }
                ]
            };
        }

        if (!filters.minDate && filters.maxDate) {
            const today = Date.now()
            query.$expr = {
                $and: [
                    { $gte: [{ $toDate: "$date" }, today] },
                    { $lte: [{ $toDate: "$date" }, new Date(filters.maxDate)] }
                ]
            };
        }

        if (filters.minDate && !filters.maxDate) {
            query.$expr = {
                $and: [
                    { $gte: [{ $toDate: "$date" }, new Date(filters.minDate)] }
                    
                ]
            };
        }
        


    }

    res.json(await db.events.get(query))
}); 

app.get('/api/read/events/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.events.get({user_id: userId}))
}); 

app.get('/api/read/event/:id', async (req, res) => {
    const _id = req.params.id
    res.json((await db.events.get({_id: new ObjectId(_id)}))[0])
}); 

app.delete('/api/delete/event/:id', async (req, res) => {
    res.json(await db.events.delete(req.params.id))
 })

//MARKET=================

app.post('/api/create/article', async (req, res) => {
    res.json(await db.market.create(req.body))
})


app.get('/api/read/articles', async (req, res) => {
    res.json(await db.market.get())
});

app.get('/api/read/articles/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.market.get({user_id: userId}))
});

app.delete('/api/delete/article/:id', async (req, res) => {
    res.json(await db.market.delete(req.params.id))
  })


//FORUM TODO===(or not, hehe)================

app.get('/api/read/forum-topics', (req, res) => {
    crud.read(FORUM_TOPICS_URL, (data) => {
        res.json(data)
      });
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

//RACELINES=============================

app.post('/api/create/raceline', async (req, res) => {
    res.json(await db.raceLines.create(req.body))
})

app.get('/api/read/racelines', async (req, res) => {
    res.json(await db.raceLines.get())
});

app.get('/api/read/raceline/:id', async (req, res) => {
    const id = req.params.id
    res.json((await db.raceLines.get({_id: new ObjectId(id)}))[0])
});

app.get('/api/read/racelines/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.raceLines.get({user_id: userId}))

});

//LAPTIME===========================


app.post('/api/create/laptime', requireAuth, async (req, res) => {
    res.json(await db.lapTimes.create(req.body))
})

app.get('/api/read/laptimes', async (req, res) => {

    let query = {};

    if(req.headers.filters){
        const filters = JSON.parse(req.headers.filters)
        console.log(filters)

        if(filters.circuit && filters.circuit !== 'all'){
            query.circuit_id = filters.circuit
        }

        if (filters.conditions && filters.lapConditions !== '' ) {
            query.lapCondition = filters.conditions
        }

        if (filters.kartType && filters.kartType !== '' ) {
            query.kartType = filters.kartType
        }
    }

    if(req.headers.filters){
        res.json(await db.lapTimes.get(query, { laptime: -1 }))
    }else{
        res.json(await db.lapTimes.get(query))
    }
    

});

app.get('/api/read/bestlaptimes/:userid', async (req, res) => {

    const userId = req.params.userid

    let query = {};

    query.user_id = userId
    query.lapCondition = 'Seco'
    query.kartType = 'Rental'

    const personalLaps = (await db.lapTimes.get(query, { laptime: 1} ))

    let result = new Set(personalLaps.map(a => a.circuit_id));

    const bestLaptimes = []

    for (const circuitId of result) { 

        const bestCircuitLap = await db.lapTimes.get({ circuit_id: circuitId, lapCondition: 'Seco', kartType: 'Rental' }, { laptime: 1 })

        const bestLap = personalLaps.find(lap => lap.circuit_id === circuitId)
        bestLaptimes.push({...bestLap, delta: (Number(bestLap.laptime) - Number(bestCircuitLap[0].laptime))})
        
    }
    res.json(bestLaptimes)

});

//MESSAGES================================

app.post('/api/create/message', requireAuth, async (req, res) => {
    res.json(await db.messages.create(req.body))

})

app.get('/api/read/messages/:userid', async (req, res) => {
    const userId = req.params.userid
    res.json(await db.messages.get({
        $or: [
            {sender_id: userId},
            {receiver_id: userId}
        ]
    }))

});

app.patch('/api/update/message/:messageid', async (req, res) => {
    const messageId = req.params.messageid
    const update = req.body
    
    res.json(await db.messages.update(messageId ,update))
    

});
//========================================


function requireAuth(req, res, next) {
    // Simulation of authentication (OAuth2)
    console.log(req.headers)
    if (req.headers.authorization === 'Bearer 123456') {
      next()
    } else {
      // Unauthorized
      res.status(401).send('Unauthorized')
    }
  }

