// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   compilers: {
//     solc: {
//       version: "0.4.17"
//     }
//   }
// };

const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const mnemonic =
  "law credit romance sell health error couple gate else strike sunny once";

module.exports = {
  networks: {
    matic: {
      provider: () =>
        new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.4.17",
    },
  },
};
