const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express()
const port = process.env.PORT||3000
//SECRET KEY
const secret = process.env.JWT_ACCESS_TOKEN
//middleware
app.use(cors())

app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster3.bp8o5mk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//JWT - CREATE TOKEN
app.post('/jwt',(req,res)=>{
  const user = req.body;
  console.log(user)
  const expiration ={expiresIn:'1h'}
  const token = jwt.sign(user,secret,expiration)
  // Send the token to the user
  res.json({
    token,
  });
  
})

//JWT- TOKEN VERICATION MIDDLEWARE

const verifyJWT = (req,res,next)=>{
  const authorization = req.headers.authorization
  if(!authorization){
    res.status(401).send({error:true,message:'Unauthorized Access'})
  }
    else{
    
      const token = authorization.split(' ')[1]
      jwt.verify(token,secret,(err,decoded)=>{
        if(err){
          res.status(401).send({error:true,message:'Unauthorized Access'})
        }
        req.decoded = decoded
        next()
      })
  }

}



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)


    const serviceCollection = client.db('carsDoctor').collection('services')
    const bookingCollection = client.db('carsDoctor').collection('bookings')

    app.get('/services',async(req,res)=>{
        const cursor = serviceCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await serviceCollection.findOne(query)
        res.send(result)
    })
    //POST
    app.post('/bookings',async(req,res)=>{
        const request = req.body;
        console.log(request)
        const result = await bookingCollection.insertOne(request)
        res.send(result)
    })

    //GET all bookings by user email
    app.get('/bookings',verifyJWT,async(req,res)=>{
      const decoded = req.decoded;
      console.log('came back after verify', decoded)

      if(decoded.email !== req.query.email){
          return res.status(403).send({error: 1, message: 'forbidden access'})
      }
       
      const query={}
      if(req.query?.email){
        query.email=req.query.email 
      }
      const cursor = bookingCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    //update
    app.put('/bookings/:id',async(req,res)=>{
      const id = req.params.id
      const body = req.body;
      const filter = { _id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          status: body.status,
        },
      };

      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.send(result)
  
    })







    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('cars doctor server')
})

app.listen(port,()=>{
    console.log("server is running at ",port)
})