import * as format from 'date-fns/format'
import {capitalize, map, upperCase} from 'lodash'
import * as nunjucks from 'nunjucks'
import * as pluralize from 'pluralize'

import {templates} from '../constants'

export class Generator {
    private readonly name: string
    private readonly template: any

    constructor(options: {name: string}) {
        this.name = options.name

        const templateRoot = `${process.cwd}../../templates`

        this.template = nunjucks.configure(
            templateRoot,
            {autoescape: true},
        )
    }

    run() {
        const filePathContext = {
            name: this.name,
            apiVersion: 'v1',
            date: format(
                new Date(),
                'GGGGMMDDHHmmss'
            ),
        }
        const context = {
            name: this.name,
            modelName: capitalize(this.name),
            tableName: upperCase(this.name),
            pluralName: pluralize(this.name),
            pluralModelName: capitalize(pluralize(this.name)),
        }

        return map(
            templates,
            (tpl: {name: string, file: string}) => ({
                    output: this.generate(tpl.name, context),
                    outputPath: this.generateString(tpl.file, filePathContext),
                ...tpl,
            }),
        )
    }

    private generateString(baseName: string, parameters: object): string {
        return this.template.renderString(baseName, parameters)
    }

    private generate(baseName: string, parameters: object): string {
        return this.template.render(`${baseName}.njk`, parameters)
    }
}
