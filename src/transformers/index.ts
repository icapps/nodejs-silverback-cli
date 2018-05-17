import * as NodeGit from 'nodegit';
import * as path from 'path';

export class Transformer {
      static async resetState() {
          const repo = await NodeGit.Repository.open(path.resolve(process.cwd()));
          const reset = await NodeGit.Reset.reset(
            repo,
            await repo.getHeadCommit(),
            NodeGit.Reset.TYPE.HARD,
          );

          return reset === 0;
      }
}
