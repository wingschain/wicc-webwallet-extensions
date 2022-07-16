# WingsMax

WingsMax is a browser extension wallet for WingsChain. 

It allows users to manage their account info, add `WRC20` token, check balance, create/import/export mnemonics, transfer WICC and `WRC20` token, etc.

More importantly, WingsMax provides the WiccWallet interface to developers. Developers can integrate `WiccWallet` when developing DAPP so that they can sign and broadcast WingsChain transactions. In turn enabling the use of DAPP from within the browser.


## Build

Because package wcer limit, need to use the Node.js v8.X for development.

Recommended to use (NVM) (https://github.com/creationix/nvm) to switch Node.js version.

After installing Nvm, execute in project root directory:

```
nvm use
```

After the switch is completed, install the required package:
```
npm install
```

After the installation is completed, execute the following commands to develop:

```bash
npm run dev
```

Execute in the root directory in terminal:

```
npm run build
```

# License
MIT
