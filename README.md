```
                      _                               _          
 ___  __ _ _   _  ___(_) ___ _ __       ___ __ _  ___| |__   ___ 
/ __|/ _` | | | |/ __| |/ _ \ '__|____ / __/ _` |/ __| '_ \ / _ \
\__ \ (_| | |_| | (__| |  __/ | |_____| (_| (_| | (__| | | |  __/
|___/\__,_|\__,_|\___|_|\___|_|        \___\__,_|\___|_| |_|\___|
                                                                         
```

# Saucier-Cache

This is a series of Express.JS compatible middlewares that provides cache related functions for Saucier. These middlewares can be used without adjustment when using Saucier to build a headless Drupal front-end.

Currently this middleware is tightly coupled with Redis. However the architecture of Saucier enables you to create your own middlware with your own cache store.

## Usage

```javascript
var saucierCache = require('saucier-cache')();
var saucier = require('saucier')(saucierGet, saucierCache, templates, {});
```

Additionally if your Redis instance is not on `localhost`, you can pass `port`, `host`, and an `options` object when requiring this module.

```javascript
var saucierCache = require('saucier-cache')(123456, 'myredis' {
  auth_pass: 'mypassword'
});
var saucier = require('saucier')(saucierGet, saucierCache, templates, {});
```

