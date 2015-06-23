# Gravitee-IO

[![Join the chat at https://gitter.im/gravitee-io/gateway-admin-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gravitee-io/gateway-admin-web?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Install

- Install [nodejs] [1]
- It comes with [npm] [2]
- Install [gulp] [3] :
```
sudo npm install -g gulp
```

- You can install from the base dir :
```
npm install
```

  - *npm install* reads **package.json** and generates the directory **node_modules**

- You can always update your project dependencies :
```
npm update
```

# Working with [gulp] [4]

Gulp tasks are run from this base dir.

## Serve

If you wanna serve the built version on dev mode :
```
gulp serve.dev
```

If you wanna serve the built version on production mode :
```
gulp serve.prod
```

[1]: http://nodejs.org
[2]: http://npmjs.org
[3]: https://github.com/gulpjs/gulp
[4]: http://gulpjs.com
