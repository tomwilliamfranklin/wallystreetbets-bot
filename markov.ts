import { stringify } from 'querystring';
import { of, zip, pipe } from 'rxjs';
import { skip } from 'rxjs/operators';
/** Class representing a Markov Chain generator */

export class FullColonOv {

  sentences: string[] = [];

  constructor(sentences: string[]) {
    this.sentences = sentences;
  }


  // parseText(text: string): string[] {
  //   // Returns a list of sentence chains extracted from text.
  //     text = text.trim();
  //     const sentences: string[] = [];

  //     for(let wordIndex in text.split(' ')) {
  //         let line = text[wordIndex];
  //         line = line.trim();
  //         line = line.substring(line.search('[^\w\s]'), line.length);
  //         line = line.toLowerCase();
  //         sentences.push(line);
  //     }

  //     return sentences;
  // }


  calcTransitionProbabilities() {
    // convert each sentence into a chain by splitting on words
    // and adding the start and end states
    const chains = [];

    for(let sentence in this.sentences) {
      //const chain = ['START', ...this.sentences[sentence].split(' '), 'END'];
      const chain =['START', ...this.sentences[sentence].split(' '), 'END'];
      chains.push(chain);  
    }
    // Find Transitions
    const transitions: any[] = [];

    for(let chain in chains) {
      // zipping a sequence with itself offset by one returns overlapping tuples
      // of adjacent items.
      zip( of(chains[chain].slice(0, chains[chain].length-1)).pipe(), of(chains[chain].slice(1)).pipe()).subscribe(resp => {
        // grabs the before word and after word and groups them together in
        // transitions array
        
        for(let bft in resp[0]) {
            transitions.push([resp[0][bft], resp[1][bft]]);
        }
      });
    }

    //console.log(transitions)

    // count transitions as well as occurrences of each word

    let totalCount: any = new Map<string, number>();
    let transitionCounts = new Map<string, Map<string, number>>();
    
    // Add the count a transition occurs in the data. This is presented as a 
    // dictionary model. 
    for(let t in transitions) {
      const bef = transitions[t][0];
      const aft = transitions[t][1];

    // if trans doesn't exist, make it 0
     if(!totalCount.get(bef)) {
        totalCount.set(bef, 0);
     }
    
     // + 1 for occurring
     totalCount.set(bef, totalCount.get(bef) + 1)
      // totalCount[t] = totalCount[t] ? totalCount[t] + 1 : 0;


      // This is where the list of probabilities are actually added.
      // so basically, it'll take a bef word such as "Hello" and then add a 
      // map next to it with the amount of times a word after occured
      // so like, {"hello", { "world": 2, "universe": 1}}
      // The example meaning, world occurred twice after hello, universe occurred once.

      // if bef word such as "hello" does not exist, add it to dictionary
      if(!transitionCounts.get(bef)) {
        transitionCounts.set(bef, new Map<string, number>());
      }
      // if the after word does not yet exist on before word entry, add it to dictionary
      if(!transitionCounts.get(bef)?.get(aft)) {
        transitionCounts.get(bef)?.set(aft, 0); 
      }

      // get value of after word, the count of occurences that is currently stored.
      const value = transitionCounts.get(bef)?.get(aft);

      // add 1 to the count of occurences and then set it as the new value for the after word
      transitionCounts.get(bef)?.set(aft, value ? value  + 1 : 0 + 1); 
    }
    //console.log(transitionCounts)

    let transitionProbabilities: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
    transitionCounts.forEach((value: Map<string, number>, bef: string) => {
      if(!transitionProbabilities.get(bef)) {
        transitionProbabilities.set(bef, new Map<string, number>());
      }

      value.forEach((count: number, aft: string) => {
          const probability = count / totalCount.get(bef);
          transitionProbabilities.get(bef)?.set(aft, probability);
      });
    });
    return transitionProbabilities;
  }
  
}
