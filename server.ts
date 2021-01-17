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

    setTimeout(() => {
        if(T) {
            const requestBody = { 
                q: 'gamestop', 
                count: 3 
            };
            // ? Get Example:
            // T.get('search/tweets',  requestBody, 
            //  (err, data: any, response) => {
            //    const tweets = data.statuses;
               
            //     // const tweets = data.statuses;

            //     for(var i = 0; i < tweets.length; i++) {
            //         console.log(tweets[i].text);
            //     }
            // });    

            // ? Post Example: 
            // const tweet = {
            //     status: 'This is a test.',
            // }

            // T.post('statuses/update', tweet, (err, data, response) => {
            //    if(err) {
            //        console.log("Something went wrong.");
            //     } else {
            //       //  console.log(data);
            //       //  console.log(response);
            //       console.log("Tweet made ", new Date());
            //     }
            // });
        }
    }, 1);

    console.log("2: Twitter API connected.");
}
//#endregion

import { FullColonOv } from './markov';
import { RedditScrapper } from './redditScrapper';


const port = process.env.PORT || 4200;
app.listen(port, () => {
    console.log(`3: Ready and listening on port ${port}...`);

    const markov = new FullColonOv();

    const redditScrapper = new RedditScrapper();

    redditScrapper.getWallstreetBetsTop().then(titles => {
        
        const map: any = [];
        Object.keys(titles).map((key: any) => map.push(titles[key]));

        const sentence = markov.generateSentence(map);
        
        console.log(sentence)
    });

});

//#endregion

//#region markov code

//#endregion