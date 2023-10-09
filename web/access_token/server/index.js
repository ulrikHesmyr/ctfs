const express = require('express');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');
const path = require('path');


const PORT = 3002;


app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, 'build' , 'index.html'));
})

app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, 'build' , 'index.html'));
})

app.set('trust proxy', true);
app.use(cookieParser);
app.use(express.json());
app.use(router);
app.listen(PORT, ()=>{
    console.log('Server is running on port ' + PORT);
})