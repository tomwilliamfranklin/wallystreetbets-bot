import twit from "twit";
import dotenv from 'dotenv';

export class WallyBot {
    T: any; 

    constructor() {
        if(!process.env.consumer_key || !process.env.consumer_secret) {
            console.log("ERROR: consumer_key and consumer_secret are required in .env file.");
            console.log("use dotenv library and create a .env file with the required variables from develop.twitter");
        } else {
            this.T = new twit({
                consumer_key: process.env.consumer_key,
                consumer_secret: process.env.consumer_secret,
                access_token: process.env.access_token,
                access_token_secret: process.env.access_token_secret,   
            });

        }
    }

    tweet(tweetText: string): void {
        setTimeout(() => {
            if(this.T) { 
                // ? Post Example: 
                const tweet = {
                    status: tweetText,
                }
    
                this.T.post('statuses/update', tweet, (err: any, data: any, response: any) => {
                   if(err) {
                       console.log("Something went wrong.");
                    } else {
                      //  console.log(data);
                      //  console.log(response);
                      console.log("Tweet made ", new Date());
                    }
                });
            }
        }, 1);
    }

    getTweets(query: string): void {
        const requestBody = { 
            q: query, 
            count: 3 
        };
        // ? Get Example:
        this.T.get('search/tweets',  requestBody, 
         (err: any, data: any, response: any) => {
           const tweets = data.statuses;
        
            // const tweets = data.statuses;

            for(var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
            }
        });   
    }
}