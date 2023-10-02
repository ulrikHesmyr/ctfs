const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});

const {PORT} = process.env;

app.use(limiter);
app.use(express.json());

app.use(router);

router.post("/api", async (req, res) => {
    const userData = require("./conf/users.json");
    console.log(userData.users);
    console.log(req.body);
    return res.send({userdata:userData});
});


app.use(express.static('../static'));


app.get("/om-oss", (req, res) => {
    res.sendFile(path.join(__dirname, '../static/pages/omOss.html'));
});

app.get("/kontakt", (req, res) => {
    res.sendFile(path.join(__dirname, '../static/pages/kontakt.html'));
});

app.get("/priser-og-avtaler", (req, res) => {
    res.sendFile(path.join(__dirname, '../static/pages/priserOgAvtaler.html'));
});

app.get("/auth", (req, res)=>{
    res.sendFile(path.join(__dirname, '../static/pages/auth.html'));
})

app.get("/robots.txt", (req, res) => {
    res.sendFile(path.join(__dirname, './conf/robots.txt'));
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../static/index.html'));
});

app.get("*", (req, res)=> {
    res.send("404 - Siden finnes ikke");
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});