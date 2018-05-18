import * as NodeGit from 'nodegit'

import {Env} from '../constants'

export const Checker = {
    preConditions: async () => {
        const dir = Env.getSettings().dir
        const repo = await NodeGit.Repository.open(dir)
        const status = await repo.getStatus({})

        if (status.length) {
            throw Error('Working tree not empty')
        }

        return true
    }
}
