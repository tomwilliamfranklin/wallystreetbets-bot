import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twit from 'twit';


console.log("bot is starting")

//#region Startup
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {

});


//#region Twit Setup 

const T = new twit({
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: '',   
});

//#endregion

const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`listening on port ${port}...`));
//#endregion