import { promises } from 'fs';
import snoowrap, { Submission } from 'snoowrap';

export class RedditScrapper {

  r: snoowrap;
  data: string[] = [];

    constructor() {
       this.r = new snoowrap({
        userAgent: 'Sentence generator based on titles and comments',
        clientId: process.env.reddit_client_id,
        clientSecret: process.env.reddit_client_secret,
        username: process.env.reddit_username,
        password: process.env.reddit_password
      });

      // initial Get
      this.dailyDataRetrieval();
    }


    async dailyDataRetrieval(): Promise<void> {
      this.getWallstreetBetsTop().then(async titles => {
        this.getWallStreetBetsComments().then(async comments => {
          const newData = titles.concat(comments);
        
          this.data = newData; 

          console.log("OVERALL DATA LENGTH: " + this.data.length);
        });
      });
    }

    async getWallstreetBetsTop(): Promise<string[]> {
          // var titlesMaps = (await r.getHot()).map(post => post.title);
          // console.log(titlesMaps)
          let wallstreetbets = (await this.r.getSubreddit('wallstreetbets').getTop()).map(post => post.title);
          
          const map: any = [];
          Object.keys(wallstreetbets).map((key: any) => map.push(wallstreetbets[key]));
          
          console.log("TITLES LENGTH: " + map.length);
          return map;
    }

    async getWallStreetBetsComments(): Promise<string[]> {
      const topPosts = (await this.r.getSubreddit('wallstreetbets').getTop()).map(post => post);
      
      let comments: string[] = [];
      // iterate through each top post today, get all the comments and add them to a massive
      //array. 
      // Promise.all(data.map) makes sure the async loop is finished. 
      await Promise.all(topPosts.map(async tp => {
        const commentsRetrived = await this.loadComments(tp);
        comments = comments.concat(commentsRetrived);
      }));
      console.log("COMMENTS LENGTH: " + comments.length)
      return comments;
    }


    async loadComments(topPost: Submission): Promise<string[]> {  
      const comments: string[] = [];
          await this.r.getSubmission(topPost.id).expandReplies({limit: 3, depth: 1}).then(resp => {
            resp.comments.forEach(c => {
              // trim whitespace on entire comment body
              let text = c.body.trim();
    
              // collapse multiple line breaks
              text = text.replace('\n+', '\n');
              
              // trim every line of comment
              for(let line in text.split('\n')) {
                line = line.trim();
              }
    
              // Add full stop if line doesn't end in punctuation.
              text = text.replace('([^.?!])(\n|$)', '\\1.\\2');
    
              // if comment length has more characters than 5
              if(text.length > 3) {
                comments.push(text);
              }
            });
          });

      return comments;
    }


}