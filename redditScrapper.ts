import snoowrap, { Submission } from 'snoowrap';

export class RedditScrapper {

  r: snoowrap;

    constructor() {
       this.r = new snoowrap({
        userAgent: 'Sentence generator based on titles and comments',
        clientId: process.env.reddit_client_id,
        clientSecret: process.env.reddit_client_secret,
        username: process.env.reddit_username,
        password: process.env.reddit_password
      });
    }


    async getWallstreetBetsTop(): Promise<string[]> {
          // var titlesMaps = (await r.getHot()).map(post => post.title);
          // console.log(titlesMaps)
          let wallstreetbets = (await this.r.getSubreddit('wallstreetbets').getTop()).map(post => post.title);
          
          const map: any = [];
          Object.keys(wallstreetbets).map((key: any) => map.push(wallstreetbets[key]));
          

          return map;
        }
}