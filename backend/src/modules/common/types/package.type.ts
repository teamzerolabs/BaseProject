export type PackageType = {
  name: string
  version: string
  description: string
  author: string
  license: 'MIT'
  dependencies: {
    [packageName: string]: string
  }
  devDependencies: {
    [packageName: string]: string
  }
}
