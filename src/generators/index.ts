import { templates } from '../constants';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { capitalize, upperCase, map } from 'lodash';
import * as pluralize from 'pluralize';

export class Generator {
  constructor(options) {
    this.name = options.name;

    const templateRoot = `${process.cwd}../../templates`;

    this.template = nunjucks.configure(
      templateRoot,
      { autoescape: true },
    );
  }

  private generate(baseName, options) :string {
    return this.template.render(`${baseName}.njk`, options);
  }

  run() {
    const context = {
      name: this.name,
      modelName: capitalize(this.name),
      tableName: upperCase(this.name),
      pluralName: pluralize(this.name),
      pluralModelName: capitalize(pluralize(this.name)),
    };

    return map(
      templates,
      ({ name }) => this.generate(name, context)
    );
  }
}