import * as NodeGit from 'nodegit';
import * as path from 'path';

export class Checker {
      static async preConditions() {
           const repo = await NodeGit.Repository.open(path.resolve(process.cwd()));
           const status = await repo.getStatus({});

           if(status.length) {
             throw Error('Working tree not empty. Aborting.')
           }

           return true;
      }
}
