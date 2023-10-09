const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});

const {PORT} = process.env;

app.use(limiter);
app.use(cookieParser());
app.use(express.json());

app.use(router);

router.post("/api/login", async (req, res) => {
    let foundUser = false;
    let userFound = null;

    const userData = require("./conf/users.json");
    userData.users.forEach(user => {
        if(user.username === req.body.username && user.password === req.body.password){
            foundUser = true;
            userFound = user;   
        } 
    });

    //Hvis vi har funnet en bruker med riktig brukernavn og passord
    if(foundUser){

        console.log("Logget inn som " + userFound.username + " from: " + req.socket.remoteAddress);
        //Hvis brukeren er admin, generer en PIN og send den til brukeren for "2FA"
        if(userFound.admin){

            //Genererer en PIN og token som er generert med jwt
            const pin = Math.floor(Math.random() * 10000);
            const token = jwt.sign({PIN:pin}, process.env.TOKEN_SECRET, {expiresIn: "1h"});

            //Legger token i cookie
            return res.cookie("twoFA_PIN", token, httpOnly=true).json({twoFA: true});

            //Hvis ikke brukeren er admin, så sender vi datae for alle brukere til klienten
        } else {
            const token = jwt.sign({brukernavn: userFound.username}, process.env.TOKEN_SECRET, {expiresIn: "1h"});

            return res.cookie("login_token", token).json({message: "Logget inn!", userData: userData, valid: true});
        }
    } else {
        return res.json({message: "Feil brukernavn eller passord!"})
    }
});

router.post("/api/twoFA", async (req, res) => {
    const {PIN} = jwt.verify(req.cookies.twoFA_PIN, process.env.TOKEN_SECRET);
    
    let pin = parseInt(req.body.pin);
    if(parseInt(PIN) === pin){
        return res.json({valid: true, message: "Logget inn!", flag:"CTF{f1nal1y_1_f0und_th3_fl4g_0-0-0_}"});
    } else {
        return res.json({valid: false, message: "Feil PIN-kode!"});
    }
})


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

app.get("/api/users.json", (req, res)=>{
    if(!req.cookies.login_token){
        return res.send("Not valid login credentials");
    }

    const token = jwt.verify(req.cookies.login_token, process.env.TOKEN_SECRET);
    if(token){
        res.sendFile(path.join(__dirname, './conf/users.json'));
    } else {
        res.send("Not valid login credentials");
    }
});

app.get("/", (req, res) => {
    
    res.sendFile(path.join(__dirname, '../static/index.html'));
});

app.get("*", (req, res)=> {
    res.send("404 - Siden finnes ikke");
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});