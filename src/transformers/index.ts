import { Env } from '../constants';
import * as NodeGit from 'nodegit';
import {promisify} from 'util';
import {writeFile} from 'fs';
import * as path from 'path';
import {map} from 'lodash'

export class Transformer {
    static async insert(templates: Object[], name: string) {
        const dir: string = Env.getSettings().dir
        const repo = await NodeGit.Repository.open(dir);

        const appendFailOnPathExistsFlag = 'ax';
        try {
            const writes = await Promise.all(map(
                templates,
                async (template: {outputPath: string, output: string}) => {
                    const fullPath = path.resolve(dir, template.outputPath)
                    await promisify(writeFile)(
                        fullPath,
                        template.output,
                        {flag: appendFailOnPathExistsFlag}
                    )
                }
            ));

            const index = await repo.refreshIndex();

            const addOp = await index.addAll(map(templates, (template) => template.outputPath));
            const indexWrite = await index.write();
            console.log(addOp)
            console.log(indexWrite)
        } catch(fileError) {
            console.log(fileError)
            throw fileError;
        }
    }

    static async resetState() {
        const dir: string = Env.getSettings().dir
        const repo = await NodeGit.Repository.open(dir);
        const reset = await NodeGit.Reset.reset(
            repo,
            await repo.getHeadCommit(),
            NodeGit.Reset.TYPE.HARD,
        );

        return reset === 0;
    }
}
