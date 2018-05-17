import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { capitalize, upperCase, map, keyBy, mapValues } from 'lodash';
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

  run(templates = [
    'controller',
    'migration',
    'model',
    'repository',
    'route',
    'schema',
    'seed',
    'serializer',
    'service'
  ]) {
    const context = {
      name: this.name,
      modelName: capitalize(this.name),
      tableName: upperCase(this.name),
      pluralName: pluralize(this.name),
      pluralModelName: capitalize(pluralize(this.name)),
    };

    return mapValues(
      keyBy(templates),
      template => this.generate(template, context)
    );
  }
}