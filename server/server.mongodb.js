import { MongoClient, ObjectId} from 'mongodb';

const URI = process.env.MONGO_URI

export const db = {
    users: {
        create: createUser,
        get: getUsers,
        update: updateUser,
        logIn: logInUser

    },
    circuits: {
        get: getCircuits,
        getLocation: getCircuitLocation
    },
    events: {
        create: createEvent,
        get: getEvents,
        getById: getEventById,
        deleteParticipant: updatePopParticipantFromArray,
        update: updateEvent,
        delete: deleteEvent
    },
    market: {
        create: createArticle,
        get: getArticles,
        delete: deleteArticle
    },
    raceLines:{
        create: createRaceLine,
        get: getRaceLines
    },
    lapTimes:{
        create: createLapTime,
        get: getLapTimes
    },
    messages:{
      create: createMessage,
      get: getMessages,
      update: updateMessage
    }

}

/*=================================USERS===========================================*/

async function createUser(user) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const userCollection = karthubDB.collection('users');
    const returnValue = await userCollection.insertOne(user);
    console.log('db createUser', returnValue, user._id)
    return user
}     

async function getUsers(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const userCollection = karthubDB.collection('users');
    return await userCollection.find(filter).toArray();
  }

/**
 * Updates a user in the 'users' collection in the 'karthub' database.
 * 
 * @param {string} id - The ID of the user to be updated.
 * @param {object} updates - The fields and new values to update the user with.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
  async function updateUser(id, updates) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const userCollection = karthubDB.collection('users');
    const returnValue = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log('db updateUser', returnValue, updates)
    return returnValue
  }

  async function logInUser({email, password}) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const usersCollection = karthubDB.collection('users');
    return await usersCollection.findOne({ email, password })
  }
/*=================================CIRCUITS===========================================*/

/**
 * Retrieves an array of circuits from the 'circuits' collection in the 'karthub' database.
 * 
 * @param {object} [filter] - The filter to apply to the documents in the collection.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of circuit objects.
 */

async function getCircuits(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const circuitCollection = karthubDB.collection('circuits');
    return await circuitCollection.find(filter).toArray();
  }


  async function getCircuitLocation(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const circuitCollection = karthubDB.collection('circuits');
    return await circuitCollection.find(filter, { projection: { location: 1, _id: 1 } }).toArray();
  }
/*=================================EVENTS===========================================*/

async function createEvent(event) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    const returnValue = await eventCollection.insertOne(event);
    console.log('db createEvent', returnValue, event._id)
    return event
}

async function getEvents(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    return await eventCollection.find(filter).toArray();
}

async function getEventById(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    return await eventCollection.findOne(filter)
}

async function updateEvent(id, updates) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    const returnValue = await eventCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log('db updateEvent', returnValue, updates)
    return returnValue
  }

  async function updatePopParticipantFromArray(id, user_id) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    const returnValue = await eventCollection.updateOne({ _id: new ObjectId(id) }, { $pull: { participants: user_id } });
    console.log('db updateArrayEvent', returnValue, user_id)
    return returnValue
  }


/**
 * Deletes an article from the 'events' collection in the 'karthub' database.
 *
 * @param {string} id - The ID of the article to be deleted.
 * @returns {Promise<string>} - The ID of the deleted article.
 */
async function deleteEvent(id) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const eventCollection = karthubDB.collection('events');
    const returnValue = await eventCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteEvent', returnValue, id)
    return id
  }
/*=================================MARKET===========================================*/

/**
 * Creates a new article in the 'market' collection in the 'karthub' database.
 * 
 * @param {object} article - The article to be created.
 * @returns {Promise<object>} - The created article.
 */
async function createArticle(article) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const marketCollection = karthubDB.collection('market');
    const returnValue = await marketCollection.insertOne(article);
    console.log('db createArticle', returnValue, article._id)
    return article
}

/**
 * Gets an array of articles from the 'market' collection in the 'karthub' database.
 * 
 * @param {object} [filter] - The filter to apply to the documents in the collection.
 * @returns {Promise<Array<object>>} - The array of articles.
 */
async function getArticles(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const marketCollection = karthubDB.collection('market');
    return await marketCollection.find(filter).toArray();
}

/**
 * Deletes an article from the 'market' collection in the 'karthub' database.
 *
 * @param {string} id - The ID of the article to be deleted.
 * @returns {Promise<string>} The ID of the deleted article.
 */
async function deleteArticle(id) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const marketCollection = karthubDB.collection('market');
    const returnValue = await marketCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteArticle', returnValue, id)
    return id
  }

  /*===========================RACELINE==========================*/

  async function createRaceLine(raceLine) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const raceLineCollection = karthubDB.collection('racelines');
    const returnValue = await raceLineCollection.insertOne(raceLine);
    console.log('db createRaceLine', returnValue, raceLine._id)
    return raceLine
}

async function getRaceLines(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const raceLineCollection = karthubDB.collection('racelines');
    return await raceLineCollection.find(filter).toArray();
}

//=================================LAPTIMES========================

async function createLapTime(lapTime) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const lapTimeCollection = karthubDB.collection('laptimes');
    const returnValue = await lapTimeCollection.insertOne(lapTime);
    console.log('db createlapTime', returnValue, lapTime._id)
    return lapTime
}

async function getLapTimes(filter) {
    const client = new MongoClient(URI);
    const karthubDB = client.db('karthub');
    const lapTimeCollection = karthubDB.collection('laptimes');
    return await lapTimeCollection.find(filter).toArray();
}

//=================================MESSAGES========================


async function createMessage(message) {
  const client = new MongoClient(URI);
  const karthubDB = client.db('karthub');
  const messagesCollection = karthubDB.collection('messages');
  const returnValue = await messagesCollection.insertOne(message);
  console.log('db createMessage', returnValue, message._id)
  return message
}

async function getMessages(filter) {
  const client = new MongoClient(URI);
  const karthubDB = client.db('karthub');
  const messagesCollection = karthubDB.collection('messages');
  return await messagesCollection.find(filter).toArray();
}

async function updateMessage(id, updates) {
  const client = new MongoClient(URI);
  const karthubDB = client.db('karthub');
  const messagesCollection = karthubDB.collection('messages');
  const returnValue = await messagesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  console.log('db updateMessage', returnValue, updates)
  return returnValue
}