const { MongoClient, ObjectId } = require('mongodb');
const Figure = require('./figure');

const url =process.env.MONGODB_URL;
const client = new MongoClient(url);


async function run()  {
  await client.connect();
  return 'Connected to the MongoDB server...';
}

run()
  .then(console.log)
  .catch(console.error);

const repo = {
  findAll: async () => {
    let figures = [];
    const figuresColl = client.db('express-figures').collection('figures');
    const cursor = figuresColl.find({});
    await cursor.forEach(doc => {
      const aFigure = new Figure(doc._id.toString(), doc.seriesName, doc.figureName, doc.version, doc.scale, doc.manufacturer, doc.releaseDate, doc.urlPage);
      figures.push(aFigure);
    });
    return figures;
  },
  findById: async (uuid) => {
    const figuresColl = client.db('express-figures').collection('figures');
    const filter = {
      '_id': new ObjectId(uuid)
    };
    const doc = await figuresColl.findOne(filter);
    return new Figure(doc._id.toString(), doc.seriesName, doc.figureName, doc.version, doc.scale, doc.manufacturer, doc.releaseDate, doc.urlPage);
  },
  create: async (figure) => {
    const doc = {seriesName: figure.seriesName, figureName: figure.figureName, version: figure.version, scale: figure.scale, manufacturer: figure.manufacturer, releaseDate: figure.releaseDate, urlPage: figure.urlPage};
    const figuresColl = client.db('express-figures').collection('figures');
    const result = await figuresColl.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  },
  deleteByID: async (uuid) => {
    const figuresColl = client.db('express-figures').collection('figures');
    const filter = {
      '_id': new ObjectId(uuid)
    };
    const result = await figuresColl.deleteOne(filter);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted the document.");
    } else  {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  },
  update: async (figure) => {
    const figuresColl = client.db('express-figures').collection('figures');
    const filter = {
      '_id': new ObjectId(figure.id)
    };
    const updateDoc = {
      $set: {
        seriesName: figure.seriesName, 
        figureName: figure.figureName, 
        version: figure.version, 
        scale: figure.scale, 
        manufacturer: figure.manufacturer, 
        releaseDate: figure.releaseDate, 
        urlPage: figure.urlPage
      }
    };
    const result = await figuresColl.updateOne(filter, updateDoc);
    console.log(`${result.matchedCount} docs matched the filter, updated ${result.modifiedCount} document(s)`);
  },
};


module.exports = repo;