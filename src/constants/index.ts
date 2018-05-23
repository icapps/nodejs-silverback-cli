import * as path from 'path'

export const templates = [
    {
        name: 'controller',
        file: 'src/controllers/{{ name }}.controller.ts',
    },
    {
        name: 'migration',
        file: 'db/migrations/{{ date }}_{{ name }}.js',
    },
    {
        name: 'model',
        file: 'src/models/{{ name }}.model.ts',
    },
    {
        name: 'repository',
        file: 'src/repositories/{{ name }}.repository.ts',
    },
    {
        name: 'route',
        file: 'src/routes/{{ apiVersion }}/{{ name }}.routes.ts',
    },
    {
        name: 'schema',
        file: 'src/schemes/{{ name }}.schema.ts',
    },
    {
        name: 'seed',
        file: 'db/seeds/{{ name }}.js',
    },
    {
        name: 'serializer',
        file: 'src/serializers/{{ name }}.serializer.ts',
    },
    {
        name: 'service',
        file: 'src/services/{{ name }}.service.ts',
    },
    {
        name: 'integration_test',
        file: 'tests/integration/{{ name }}.route.test.ts',
    },
    {
        name: 'test_payload',
        file: 'tests/_helpers/payload-schemes/{{ name }}.schema.ts',
    },
    {
        name: 'mock',
        file: 'tests/_helpers/mockdata/{{ name }}.data.ts',
    },
]

export const enum ModificationTypes {
    Import,
    Export,
    ListAdd,
}

export const modifications = [
    {
        file: 'src/constants.ts',
        modifications: [
            {
                change: ModificationTypes.ListAdd,
                id: 'tableNames',
                template: '\n  {{ codeName }}: \'{{ pluralName }}\','
            },
        ]
    },
    {
        file: 'src/routes/{{ apiVersion }}/index.ts',
        modifications: [
            {
                change: ModificationTypes.Import,
                template: '\nimport { routes as {{ name }}Routes } from \'./{{ name }}.routes\';'
            },
            {
                change: ModificationTypes.Export,
                template: '\n  .use(\'/{{name}}\', {{ name }}Routes);'
            }
        ]
    },
]

export class Env {
    static initSettings(dir: string) {
        if (!Env.instance) {
            Env.instance = new Env(path.resolve(dir))
            return Env.instance
        }

        throw Error('Settings already initialized')
    }

    static getSettings() {
        if (Env.instance) {
            return Env.instance
        }

        throw Error('Settings not initialized')
    }

    private static instance: Env

    public dir: string

    private constructor(dir: string) {
        this.dir = dir
    }
}
