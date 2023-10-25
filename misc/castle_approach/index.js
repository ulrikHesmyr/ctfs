const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const helmet = require("helmet");

const {FLAG, ENV, LOGINROUTE, PORT} = process.env;



async function ipValidation(req,res,next){
    
    //Dersom brukeren har dansk IP-addresse (på dansk IP-range), så endres denne til true
    let funn = false;

    //Henter IP-addressen fra requesten
    let ipstring = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    //Henter alle danske IP-ranges
    const request = await fetch("https://cdn-lite.ip2location.com/datasets/DK.json?_=1698242664612");
    const danishIPRanges = await request.json();

    //NB fjern før prod
    if(ENV == "DEV"){
        ipstring = "193.104.43.0";
    }

    //Går igjennom alle danske IP-addresser og ser etter en match med "ipstring" fra brukeren
    for(let i = 0; i < danishIPRanges.data.length; i++){
        if(danishIPRanges.data[i][0] == ipstring || danishIPRanges.data[i][1] == ipstring){
            funn = true;
            break;
        }
    }

    if(funn){
        return next();
    } else {
        return res.send("Du er ikke dansker! Er du på arbejdsrejse, så brug virksomhedens VPN")
    }
    
}

app.use(helmet());
app.use(ipValidation);
app.use(express.json());
app.use(express.static("build"));
app.use(express.static("protected_build"))

app.get("/flag.json", (req,res)=>{
    return res.sendFile(path.join(__dirname, "flag.json"));
})

app.get("/for-medarbejdere", (req, res)=>{
    return res.send("[system-admin]: Vi er skiftet til nye databasesystemer, og adgangskoderne er blevet nulstillet. Send en mail til anna.madsen.hansen@gmail.com for at få adgangs-oplysninger");
});

app.post("/api/adgang", (req, res)=>{
    console.log(req.body);
    const {username, password} = req.body;
    if(username == "nyBruger8371" && password == "1337adgangskode"){
        return res.status(200).json({message:`Velkommen! ${FLAG}`});
    } else {
        return res.status(200).json({message:"Du har allerede et brugernavn og adgangskode, tjek din e-mailen fra Anna"});
    }
})

app.get(`/${LOGINROUTE}`, (req, res)=>{
    //res.send(FLAG).status(200);
    
    return res.status(200).sendFile(path.join(__dirname, "protected_build", "index.html"));
})

app.get('/', (req, res) => {
    
    
    return res.sendFile(path.join(__dirname, "build", "index.html"))
});

app.listen(PORT, () => {
    console.log('Server listening on port 3000');
});
