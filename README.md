![BOOKit Logotype](./docs/Logotype.png)

[![](https://img.shields.io/npm/v/@smsnm/bookit)](https://www.npmjs.com/package/@smsnm/bookit)
![](https://github.com/samsonium/bookit/actions/workflows/deploy.yml/badge.svg)
![](https://snyk.io/test/github/samsoniunm/bookit/badge.svg)


### Description
This project will allow you to quickly set up backend services in TypeScript. 
The main point is to use decorators to automatically declare routers and paths.

### How to use
1. Install BOOKit as dependency
    - By npm: `npm i @smsnm/bookit`
    - By yarn: `yarn add @smsn/bookit`
    - By pnpm: `pnpm add @smsn/bookit`
2. Write a class to be used as a router:
   ```typescript
   import { Router } from '@smsnm/bookit';
   
   @Router()
   export default class MainRouter {}
   ```
3. Add method with decorator (for example GET):
   ```typescript
   import { Router, Get } from '@smsnm/bookit';
   
   @Router()
   export default class MainRouter {
   
      @Get()
      hello() {
         return '<h1>Hello, BOOKit!</h1>';
      }
   }
   ```
4. In main script initialize common class and add the router:
   ```typescript
   import { Bookit } from '@smsnm/bookit';
   import MainRouter from 'path/to/router';
   
   const kit = new Bookit();
   kit.addRouters(MainRouter);
   kit.start(7910, 'Server started!');
   ```
5. Run!

### Documentation
Documentation can be found at: https://samsonium.github.io/bookit/
This is a temporary documentation, which, in the future, will be replaced by the normal 🙃

### Contributing
Contribution guide is under development...
