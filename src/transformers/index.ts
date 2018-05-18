import {writeFile} from 'fs'
import {map} from 'lodash'
import * as NodeGit from 'nodegit'
import * as path from 'path'
import {promisify} from 'util'

import {Env} from '../constants'

export const Transformer = {
    insert: async (templates: object[]) => {
        const dir: string = Env.getSettings().dir
        const repo = await NodeGit.Repository.open(dir)

        const appendFailOnPathExistsFlag = 'ax'
        try {
            await Promise.all(map(
                templates,
                async (template: {outputPath: string, output: string}) => {
                    const fullPath = path.resolve(dir, template.outputPath)
                    await promisify(writeFile)(
                        fullPath,
                        template.output,
                        {flag: appendFailOnPathExistsFlag}
                    )
                }
            ))

            const index = await repo.refreshIndex()

            // Add all files
            await index.addAll(map(templates, (template: {outputPath: string}) => template.outputPath))

            // Write to stage index
            return index.write()
        } catch (fileError) {
            throw fileError
        }
    },

    resetState: async () => {
        const dir: string = Env.getSettings().dir
        const repo = await NodeGit.Repository.open(dir)
        const reset = await NodeGit.Reset.reset(
            repo,
            await repo.getHeadCommit(),
            NodeGit.Reset.TYPE.HARD,
        )

        return reset === 0
    }
}
