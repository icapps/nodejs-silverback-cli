export const templates = [
  {
    name: 'controller'
    outputPath: 'src/controllers/{{ name }}.controller.ts',
  },
  {
    name: 'migration'
    outputPath: 'db/migrations/{{ date }}_{{ name }}.js',
  },
  {
    name: 'model'
    outputPath: 'src/models/{{ name }}.model.ts',
  },
  {
    name: 'repository'
    outputPath: 'src/repositories/{{ name }}.repository.ts',
  },
  {
    name: 'route'
    outputPath: 'src/routes/{{ apiVersion }}/{{ name }}.routes.ts',
  },
  {
    name: 'schema'
    outputPath: 'src/schemes/{{ name }}.schema.ts',
  },
  {
    name: 'seed'
    outputPath: 'db/seeds/{{ name }}.js',
  },
  {
    name: 'serializer'
    outputPath: 'src/serializers/{{ name }}.serializer.ts',
  },
  {
    name: 'service'
    outputPath: 'src/services/{{ name }}.service.ts',
  },
];