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

> The earliest version of Typescript supported by this package is actually v2.8.0 because
Typescript Enhaced uses the internal mechanism of `tsc` watch mode. Maybe, if demanded,
in a future release this could be upgraded.


### Usage
```bash
npm i --save-dev typescript typescript-enhanced
tsce
```

> This packages wraps the actual tsc command, so it needs typescript to work.
> Typescript Enhanced uses Typescript as peer dependency to make you able to
> use any version of the package.

### Enhancements
#### Custom Transformers
With Typescript Enhanced you will be able to create any custom transformer you
want to your source code using the internal mechanism of Typescript (since
version v2.3.0).

To enable this enhacement just add to your `tsconfig.json` the following line.
```json5
{
  // ...
  "compilerOptions": {
      // ...
      "customTransformers": [
          {
              module: "<module path>",
              type: "<before/after>",
              options: {},
          }
      ]
      // ...
  }
  // ...
}
```

The custom transformer option applies the all the transformations on the order
you specify them. You can find some custom transformer examples on the
test folder.

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

#### On Fail/Success Commands for watch mode
Sometimes do you want to do anything on watch mode states like starting a
server or execute a post-process. This is actually imposible with the `tsc`
command but `tsce` is able to manage this situation.

To enable this enhacement just add to your `tsconfig.json` the following line.
```json5
{
  // ...
  "compilerOptions": {
      // ...
      "onWatchFail": "<My command>",
      "onWatchSuccess": "<My command>"
      // ...
  }
  // ...
}
```

or just by adding the following parameters to the `tsce` command call

```bash
tsce --watch --onWatchFail <My command> --onWatchSuccess <My command>
```
### Contribution
Any contribution to upgrade this package is actually welcome :)
