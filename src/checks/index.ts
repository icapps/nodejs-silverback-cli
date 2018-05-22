import * as NodeGit from 'nodegit'

import {Env} from '../constants'

const getModifiedPaths = async () => {
    const dir = Env.getSettings().dir

    const repo = await NodeGit.Repository.open(dir)

    // See https://github.com/libgit2/libgit2/blob/master/include/git2/status.h#L137 for available flags
    const optStatFlag = NodeGit.Status.OPT.INCLUDE_UNTRACKED + NodeGit.Status.OPT.INCLUDE_UNTRACKED_DIRS;

    const status = await repo.getStatusExt(optStatFlag)

    return status.map((el: {path: () => string}) => el.path())
}

const preConditions = async () => {
    if ((await getModifiedPaths()).length) {
        throw Error('Working tree not empty')
    }

    return true
}

export const Checker = {
    getModifiedPaths,
    preConditions,
}
