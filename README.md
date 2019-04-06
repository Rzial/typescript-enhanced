Typescript Enhanced
===================

[Typescript Enhanced](https://github.com/Rzial/typescript-enhanced) is an
extension of the existing Typescript package that modifies the functionality of
the `tsc` command giving it some superpowers.

This package aims for the following guidelines:
* Minimal external dependency
* Minimal modifications on the original Typescript package
* Minimal workflow changes 
* Maximal clarity of code

Other solutions that do the same task as Typescript Enhanced don't follow
anything similar to this making hard knowing what happens under the hood. In
this package you will be able to understand what is happening on the
enhancements just by reading their source files.

### Usage
```bash
npm i --save-dev typescript typescript-enhanced
tsce
```

> This packages wraps the actual tsc command, so it needs typescript to work.
> Typescript Enhanced uses Typescript as peer dependency to make you able to
> use any version of the package.

### Enhancements
#### Resolve Aliased Modules
In Typescript Enhanced you will be able to finally resolve those messy imports 
that don't let you work on Node.js.
To enable this enhacement just add to your `tsconfig.json` the following line.
```json5
{
  // ...
  "compilerOptions": {
      // ...
      "resolveAliasedModules": true
      // ...
  }
  // ...
}
```

This is applied as the last before transformation of the chain so you can
modify its behaviour by using any before transformer if you want.
