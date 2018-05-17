import NodeGit from 'nodegit';

export class Check {
      static async preConditions {
           const repo = await NodeGit.Repository.open(process.cwd);
           const status = await repo.getStatus({});
           const workingTreeEmpty = status.length === 0;

           return workingTreeEmpty;
      }
}
