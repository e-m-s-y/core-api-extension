# Core API extension
A core plugin that extends the core-api package by adding custom endpoints.

## Features
- Delegate ranking

## Installation
Use these steps if you installed your node using Git clone.

1. Go to the plugin directory `cd ~/ark-core/plugins`.
2. Clone the plugin `git clone https://github.com/e-m-s-y/core-api-extension -b ark`.
3. Install and build the plugin `cd core-api-extension && pnpm install && pnpm build`.
5. Customize the plugin configuration to your needs.
6. Add the configuration to `~/.config/ark-core/{mainnet|testnet}/app.json` at the bottom of relay.plugins.
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
