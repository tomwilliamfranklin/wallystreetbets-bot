import snoowrap, { Submission } from 'snoowrap';

export class RedditScrapper {
    constructor() {
    }


    async getWallstreetBetsTop(): Promise<string[]> {
          const r = new snoowrap({
          });
          // var titlesMaps = (await r.getHot()).map(post => post.title);
          // console.log(titlesMaps)
          
          let wallstreetbets = (await r.getSubreddit('wallstreetbets').getTop()).map(post => post.title);
          
          return wallstreetbets;
        }
}