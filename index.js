const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())


// const verifyJWT = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     console.log('Iam',authHeader);
//     if (!authHeader) {
//         return res.status(401).send({ message: 'Unauthorized access' })
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden access' })
//         }
//         req.decoded = decoded;
//         next()
//     })

// }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@hmelectronics.qnmf1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db('hm-electronics').collection('users');
        const toolsCollection = client.db('hm-electronics').collection('tools');
        const orderCollection = client.db('hm-electronics').collection('orders');
        const reviewCollection = client.db('hm-electronics').collection('review');
        //tools post api
        app.post('/tools', async (req, res) => {
            const newTools = req.body;
            const result = await toolsCollection.insertOne(newTools);
            res.send(result)
        })

        //tools provide api
        app.get('/tools', async (req, res) => {
            const query = {};
            const result = await toolsCollection.find(query).toArray();
            res.send(result)
        })

        //find tools by id
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await toolsCollection.findOne(query);
            res.send(result)
        })

        //Order
        app.post('/order', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result)
        })
        //
        //manageOrder
        app.get('/order', async (req, res) => {
            const query = {};
            const result = await orderCollection.find(query).toArray();
            res.send(result)

        })
        // get my Orders
        app.get('/order/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })
        //users collector api
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const name = req.body.name;
            const filter = { email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: { email: email, name: name }
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token })
        })
        //update profile
        app.put('/users/profile/:email', async (req, res) => {
            const email = req.params.email;
            const name = req.body.name;
            const address = req.body.address;
            const phone = req.body.phone;
            const education = req.body.education;
            const filter = { email: email };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: name, address: address, phone: phone, education: education
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        //user Profile
        app.get('/users/profile/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query)
            res.send(result)
        })
        //make admin
        app.put('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const updatedDoc = {
                $set: { role: 'admin' }
            };
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result)
        })

        // get all admin
        app.get('/users/:admin', async (req, res) => {
            const admin = req.params.admin;
            const query = { role: admin };
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        //all user sender api
        app.get('/users/makeadmin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        //users profile api
        app.get('/users/profile/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = userCollection.findOne(query);
            res.send(result)
        })
        //review
        app.post('/review', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result)
        })
        //review sender
        app.get('/review', async (req, res) => {
            const query = {};
            const result = await reviewCollection.find(query).toArray();
            res.send(result)
        })

    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('server is running');
})