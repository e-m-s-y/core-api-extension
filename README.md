# Core API extension
A core plugin that extends the core-api package by adding custom endpoints.

## Features
- Delegate ranking

## Prerequisites
Add the following pnpm alias to `~/.solarrc` if you haven't already. Replace `{user}` with the user's name.

`alias pnpm="source /home/{user}/.solar/.env; /home/{user}/.solar/.pnpm/bin/pnpm"`.

Restart your SSH session once added.

## Installation
Use these steps if you installed your node using Git clone.

1. Go to the plugin directory `cd ~/solar-core/plugins`.
2. Clone the plugin `git clone https://github.com/e-m-s-y/core-api-extension`.
3. Install and build the plugin `cd core-api-extension && pnpm install && pnpm build`.
5. Customize the plugin configuration to your needs.
6. Add the configuration to `~/.config/solar-core/{mainnet|testnet}/app.json` at the bottom of relay.plugins.
7. Restart your relay process.

#### Plugin configuration example
```js
{
    "package": "@foly/core-api-extension",
    "options": {
        "enabled": true
    }
}
```

## Credits

- [e-m-s-y](https://github.com/e-m-s-y)

## License

[CC BY-ND 4.0](LICENSE.md)
