import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twit from 'twit';

console.log("1: Starting Bot...");

//#region Startup
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {

});


//#region Twit Setup 
if(!process.env.consumer_key || !process.env.consumer_secret) {
    console.log("ERROR: consumer_key and consumer_secret are required in .env file.");
    console.log("use dotenv library and create a .env file with the required variables from develop.twitter");
} else {
    const T = new twit({
        consumer_key: process.env.consumer_key,
        consumer_secret: process.env.consumer_secret,
        access_token: process.env.access_token,
        access_token_secret: process.env.access_token_secret,   
    });

    // setTimeout(() => {
    //     if(T) {
    //         T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
    //             console.log(data)
    //         });    
    //     }
        
    // }, 1);

    console.log("2: Twitter API connected.");
}
//#endregion

const port = process.env.PORT || 4200;
app.listen(port, () => {
    console.log(`3: Ready and listening on port ${port}...`);
});

//#endregion


//#region 

//#endregion