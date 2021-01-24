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
app.listen(port, async () => {
    console.log(`3: Ready and listening on port ${port}...`);

    const markov = new FullColonOv();

    const redditScrapper = new RedditScrapper();
    await redditScrapper.dailyDataRetrieval();

    const wally = new WallyBot();

        setTimeout(async () => { // Get new data every 24 hours.

            var dayMillseconds = 1000 * 60 * 60 * 24;
            setInterval(async () => { // repeat this every 24 hours
                await redditScrapper.dailyDataRetrieval();
                
                const tweetMessage = markov.generateSentence(redditScrapper.data);
            
            }, dayMillseconds)
        }, tradingOpen());


        // every hour tweet message
        setInterval(async () => { // repeat this every 24 hours
            const tweetMessage = markov.generateSentence(redditScrapper.data);

           // console.log(tweetMessage)
           wally.tweet(tweetMessage);
        }, 25000);


});


function tradingOpen(){
    var d = new Date();
    return (-d + d.setHours(16,0,0,0));
}

//#endregion
