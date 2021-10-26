const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const port = 7000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("GinusMecanic");
    const servicescollection = database.collection("Services");

    // get API
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicescollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    // get singel api
    app.get(`/services/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicescollection.findOne(query);
      res.send(result);
    });

    // api post
    app.post("/services", async (req, res) => {
      const services = req.body;
      const result = await servicescollection.insertOne(services);
      res.send(result);
    });

    // delete api
    app.delete(`/services/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicescollection.deleteOne(query);

      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is chaking purpose for heroku");
});

app.listen(port, () => {
  console.log("genius car mecanic", port);
});
