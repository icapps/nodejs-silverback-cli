import { Env } from '../constants'
import * as NodeGit from 'nodegit';
import * as path from 'path';

export class Checker {
    static async preConditions() {
        const dir = Env.getSettings().dir;
        const repo = await NodeGit.Repository.open(dir);
        const status = await repo.getStatus({});

        if(status.length) {
            throw Error('Working tree not empty')
        }

        return true;
    }
}
