import {readFile, writeFile} from 'fs'
import {find, last, map} from 'lodash'
import * as NodeGit from 'nodegit'
import * as path from 'path'
import * as ts from 'typescript'
import {promisify} from 'util'

import {Env, ModificationTypes} from '../constants'

interface Modification {
    change: ModificationTypes,
    output: string,
}

interface FileMod {
    outputPath: string,
    modifications: Modification[],
}

interface Statement {
    end: number,
    start: number,
    kind: ts.SyntaxKind,
}

const FS_FLAGS = {
    APPEND_FAILONPATHEXISTSFLAG: 'ax',
    WRITE_CREATEIFNOTEXISTS: 'w',
}

async function addPathsToStage(paths: string[]) {
    const dir: string = Env.getSettings().dir
    const repo = await NodeGit.Repository.open(dir)
    const index = await repo.refreshIndex()

    // Add all files
    // @ts-ignore
    await index.addAll(paths)

    // Write to stage index
    return index.write()
}

export const Transformer = {
    insert: async (templates: object[]) => {
        const dir: string = Env.getSettings().dir

        try {
            await Promise.all(map(
                templates,
                async (template: {outputPath: string, output: string}) => {
                    const fullPath = path.resolve(dir, template.outputPath)
                    await promisify(writeFile)(
                        fullPath,
                        template.output,
                        {flag: FS_FLAGS.APPEND_FAILONPATHEXISTSFLAG}
                    )
                }
            ))
        } catch (fileError) {
            throw fileError
        } finally {
            // Add all files
            // @ts-ignore
            await addPathsToStage(map(
                templates,
                (template: {outputPath: string}) => template.outputPath))
        }
    },

    resetState: async () => {
        const dir: string = Env.getSettings().dir
        const repo = await NodeGit.Repository.open(dir)

        // Reset committed files
        // @ts-ignore
        const reset = await NodeGit.Reset.reset(
            repo,
            await repo.getHeadCommit(),
            NodeGit.Reset.TYPE.HARD,
        )

        return reset === 0
    },

    modifyExistingFiles: async (fileMods: FileMod[]) => {
        try {
            return Promise.all(map(fileMods, async fileMod => {
                const dir: string = Env.getSettings().dir
                const fullPath = path.resolve(dir, fileMod.outputPath)

                let sourceCode = await promisify(readFile)(
                    fullPath,
                    {encoding: 'utf8'}
                ) // TODO: Remove mutable state

                // Turn the TypeScript sourcefile into a parsable AST
                // (so we can find the correct insertion point)
                const sourceFile = ts.createSourceFile(
                    fullPath,
                    sourceCode,
                    ts.ScriptTarget.ES2015,
                    false, //setParentNodes (Don't need these)
                )

                const {statements} = sourceFile

                // Prepare all file modifications
                const fileUpdates = map(fileMod.modifications, sourceMod => {
                    // TODO: Refactor into separate functions
                    if (sourceMod.change === ModificationTypes.Import) {
                        // @ts-ignore
                        const targetStatement = find(statements, (statement: Statement, index: number) => {
                            if (statement.kind !== ts.SyntaxKind.ImportDeclaration) {
                                return false
                            }

                            // Peek ahead to see if this is the last import declaration
                            if (statements[index + 1] &&
                               statements[index + 1].kind === ts.SyntaxKind.ImportDeclaration) {
                                return false
                            }

                            // If so, we know where to insert the new declaration
                            return true
                        })

                        if (!targetStatement) {
                            throw new Error('Could not find target for import modification')
                        }

                        return {
                            // @ts-ignore
                            start: targetStatement.end,
                            // @ts-ignore
                            end: targetStatement.end,
                            replacement: sourceMod.output,
                        }
                    }

                    if (sourceMod.change === ModificationTypes.Export) {
                        return {
                            start: sourceFile.endOfFileToken.pos - 1,
                            end: sourceFile.endOfFileToken.pos,
                            replacement: sourceMod.output,
                        }
                    }

                    if (sourceMod.change === ModificationTypes.ListAdd) {
                        const targetStatement = find(statements, (statement: Statement) => {
                            if (statement.kind !== ts.SyntaxKind.VariableStatement) {
                                return false
                            }

                            // @ts-ignore
                            const variableStatement = statement as ts.VariableStatement

                            const declaration = variableStatement.declarationList.declarations[0]
                            // @ts-ignore
                            if (declaration.name.escapedText !== sourceMod.id) {
                                return false
                            }

                            return true
                        })

                        // @ts-ignore
                        const lastStatementPos = last(targetStatement.declarationList.declarations[0].initializer.properties).end + 1

                        return {
                            start: lastStatementPos,
                            end: lastStatementPos,
                            replacement: sourceMod.output,
                        }
                    }
                }).reverse() // We reverse the modifications map so changes in text length don't impact replacement targets

                // @ts-ignore
                for (const {start, end, replacement} of fileUpdates) {
                    sourceCode = sourceCode.slice(0, start) + replacement + sourceCode.slice(end)
                }

                return promisify(writeFile)(
                    fullPath,
                    sourceCode,
                    {flag: FS_FLAGS.WRITE_CREATEIFNOTEXISTS}
                )
            }))
        } catch (modError) {
            throw modError
        } finally {
            await addPathsToStage(map(
                fileMods,
                (mod: {outputPath: string}) => mod.outputPath))
        }
    },
}
