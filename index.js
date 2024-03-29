const express = require("express")
const urlRoute = require('./routes/url')
const path = require("path")
const {connectToMongoDB} = require('./connection')
const URL = require('./models/url')
const staticRouter = require('./routes/staticRouter')

const app = express();
const PORT = 8001;
//Connecting to Database
connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(()=>console.log("Connected to DataBase"))
    .catch(err => console.error("Error connecting to database:", err));

app.set("view engine","ejs")
app.set('views',path.resolve('./views'))

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))

//Routes
app.use('/url',urlRoute)
app.use('/',staticRouter)
app.get('/url/:shortId',async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{$push : {
        visitHistory : {
            timestamp : Date.now()
        }
    }})
    res.redirect(entry.redirectURL);
})

app.listen(PORT,()=>console.log(`Server started at PORT ${PORT}`))