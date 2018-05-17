import {capitalize, map, upperCase} from 'lodash'
import * as nunjucks from 'nunjucks'
import * as pluralize from 'pluralize'

import {templates} from '../constants'

export class Generator {
  constructor(options) {
    this.name = options.name

    const templateRoot = `${process.cwd}../../templates`

    this.template = nunjucks.configure(
      templateRoot,
      {autoescape: true},
    )
  }

  run() {
    const context = {
      name: this.name,
      modelName: capitalize(this.name),
      tableName: upperCase(this.name),
      pluralName: pluralize(this.name),
      pluralModelName: capitalize(pluralize(this.name)),
    }

    return map(
      templates,
      ({name}) => this.generate(name, context)
    )
  }

  private generate(baseName, options): string {
    return this.template.render(`${baseName}.njk`, options)
  }
}
