import {Command, flags} from '@oclif/command'
import { Generator } from '../generators'

export default class Generate extends Command {
  static description = 'Use templates to scaffold a bunch of boilerplate code'

  static flags = {
    name: flags.string({char: 'n', description: 'name to print'}),
  }

  static args = [{name: 'name', required: true, description: 'the singular model name'}]

  async run() {
    const {args, flags} = this.parse(Generate)

    // Check pre-conditions
    this.log(`Ensuring clean initial state`);
    // TODO: Checker.preConditions()

    // Create templates
    this.log(`Generating templates for ${args.name}`)
    const templates = new Generator({ name: args.name }).run()

    // Insert templates
    this.log(`Inserting templates`);
    // TODO: Transformer.insert(templates)

    // Modify existing code
    this.log(`Modifying existing bindings`);
    // TODO: Transformer.modify()

    // Check post-conditions
    this.log(`Ensuring clean end state`);
    // TODO: Checker.postConditions()
  }
}
