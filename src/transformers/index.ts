import * as ts from "typescript";
import * as fs from "fs";
import {writeFile, readFile} from 'fs'
import {map, filter, find} from 'lodash'
import * as NodeGit from 'nodegit'
import * as path from 'path'
import {promisify} from 'util'
import {Checker} from '../checks'

import {Env, ModificationTypes} from '../constants'
import { SyntaxKind } from 'typescript';

interface Replacement {
    start: number;
    end: number;
    replacement: string;
}

interface Statement {
    end: string,
    start: string,
    kind: SyntaxKind,
}

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
        } catch (fileError) {
            throw fileError
        } finally {
            const index = await repo.refreshIndex()

            // Add all files
            await index.addAll(map(
                templates,
                (template: {outputPath: string}) => template.outputPath))

            // Write to stage index
            return index.write()
        }
    },

    resetState: async () => {
        const dir: string = Env.getSettings().dir
        const repo = await NodeGit.Repository.open(dir)

        // Reset committed files
        const reset = await NodeGit.Reset.reset(
            repo,
            await repo.getHeadCommit(),
            NodeGit.Reset.TYPE.HARD,
        )

        return reset === 0
    },

    modifyExistingFiles: async (fileMods) => {
        // Map files
          // Convert to sourceFile -> Map mods

        map(fileMods, async (fileMod) => {
            const dir: string = Env.getSettings().dir
            const fullPath = path.resolve(dir, fileMod.outputPath)

            let sourceCode = await promisify(readFile)(
                fullPath,
                { encoding: 'utf8' }
            ); // TODO: Remove mutable state

            // Turn the TypeScript sourcefile into a parsable AST
            // (so we can find the correct insertion point)
            const { statements } = ts.createSourceFile(
                fullPath,
                sourceCode,
                ts.ScriptTarget.ES2015,
                /*setParentNodes */ false, // Don't need these
            );

            // Prepare all file modifications
            const fileUpdates = map(fileMod.modifications, sourceMod => {
                if(sourceMod.change === ModificationTypes.Import) {
                    const targetStatement = find(statements, (statement: Statement, index: number) => {
                        console.log(ts.SyntaxKind[statement.kind])
                        if (statement.kind !== ts.SyntaxKind.ImportDeclaration) {
                            return false;
                        }

                        // Peek ahead to see if this is the last import declaration
                        if(statements[index + 1] &&
                           statements[index + 1].kind === ts.SyntaxKind.ImportDeclaration) {
                            return false;
                        }

                        // If so, we know where to insert the new declaration
                        return true;
                    });

                    return {
                        start: targetStatement.end,
                        end: targetStatement.end,
                        replacement: sourceMod.output,
                    };
                }
            }).reverse(); // We reverse the modifications map so changes in text length don't impact replacement targets

            for (const { start, end, replacement } of fileUpdates) {
                sourceCode = sourceCode.slice(0, start) + replacement + sourceCode.slice(end)
            }

            await promisify(writeFile)(
                fullPath,
                sourceCode,
                {flag: 'w'}
            )
        })
    },
}
