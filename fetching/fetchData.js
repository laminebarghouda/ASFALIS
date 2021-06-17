const LocalAuthority = require('../client/src/contracts/LocalAuthority.json')
const getWeb3 = require("./getWeb3");


getWeb3
    .then(results => {
        // Instantiate contract once web3 provided.
        const contract = require('truffle-contract')
        const report = contract(LocalAuthority)
        report.setProvider(results.web3.currentProvider)

        // Get accounts.
        results.web3.eth.getAccounts((error, accounts) => {
            report.deployed().then((instance) => {
                this.report = instance
            }).then((ipfsHash) => {
                this.report.sendReclamation("TEST", "TEST", "TEST", {from: accounts[0]}).then(() => {
                    // Get the value from the contract to prove it worked.
                    this.report.contract.getPastEvents('AMMAdded',
                        {
                            fromBlock: 0,
                        },
                        (error, events) => {
                            console.log('EVENT : ', events)
                        });
                });
            })
        })


    })
    .catch(() => {
        console.log('Error finding web3.')
    })
