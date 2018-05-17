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

    // check pre-conditions
    this.log(`Ensuring clean initial state`);

    // create templates
    this.log(`Generating templates for ${args.name}`)
    const generator = new Generator({ name: args.name })
    const templates = generator.run();
      console.log(templates)

    // insert templates
    this.log(`Inserting templates`);

    // modify existing code
    this.log(`Modifying existing bindings`);

    // check post-conditions
    this.log(`Ensuring clean end state`);
  }
}
