import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FullColonOv } from './markov';
import { RedditScrapper } from './redditScrapper';
import { WallyBot } from './tweetBot';

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
}
//#endregion


const port = process.env.PORT || 4200;
app.listen(port, () => {
    console.log(`3: Ready and listening on port ${port}...`);

    const markov = new FullColonOv();

    const redditScrapper = new RedditScrapper();

    const wally = new WallyBot();

    redditScrapper.getWallstreetBetsTop().then(titles => {
        redditScrapper.getWallStreetBetsComments().then(comments => {
         const sentence = markov.generateSentence(titles.concat(comments));
        
        console.log(sentence)

        //wally.tweet(sentence);    
        });
    });



});

//#endregion

//#region markov code

//#endregion