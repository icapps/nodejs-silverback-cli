import {expect, test} from '@oclif/test'
import {execSync} from 'child_process'

import {Checker} from '../../src/checks'
import {Env, templates as originalTemplates} from '../../src/constants'
import {Generator} from '../../src/generators'
import {Transformer} from '../../src/transformers'

const dir = 'test/nodejs-silverback'

describe('generate', async () => {
  test
  .it('Correctly handles option setting/getting', async () => {
    expect(Env.getSettings).to.throw('Settings not initialized')
  })

  test
  .stdout()
  .command(['generate', '-d', dir, 'jeff'])
  .it('Generates a model', async ctx => {
    expect(ctx.stdout).to.contain('Ensuring clean initial state\nGenerating templates for jeff\nInserting templates\nModifying existing bindings\n')
    await Transformer.resetState()
  })

  describe('units', () => {
    afterEach(async function () {
      await Transformer.resetState()
    })
    beforeEach(async function () {
      await Transformer.resetState()
    })

    test
    .it('Aborts when the working tree is not empty', async () => {
      execSync(`touch ${dir}/teehee`, {encoding: 'utf8'})
      try {
        await Checker.preConditions()
      } catch (e) {
        expect(e.message).to.equal('Working tree not empty')
      }
      execSync(`cd ${dir}; git add .; cd -`, {encoding: 'utf8'})
    })

    test
    .it('Does not allow settings to be set twice', () => {
     expect(Env.getSettings().dir).to.equal(`${process.cwd()}/${dir}`)
     expect(Env.initSettings.bind('', process.cwd())).to.throw('Settings already initialized')
   })

    test
     .it('Transforms a set of templates using a model name', () => {
     const {templates} = new Generator({name: 'gert'}).run()
     expect(templates.length).to.equal(originalTemplates.length)
   })

    test
   .it('Insert templates correctly', async () => {
     const {templates, modifications} = new Generator({name: 'gert'}).run()

     await Transformer.insert(templates)
     await Transformer.modifyExistingFiles(modifications)

     const changed = (await Checker.getModifiedPaths()).length
     expect(changed).to.equal(14)
   })
  })
})
