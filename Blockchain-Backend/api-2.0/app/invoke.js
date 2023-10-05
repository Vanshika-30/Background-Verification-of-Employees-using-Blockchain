const { Gateway, Wallets, TxEventHandler, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')

const helper = require('./helper')

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name, transientData) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        // load the network configuration
        // const ccpPath =path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(org_name) //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }



        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: {
                commitTimeout: 100,
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
            }
            // transaction: {
            //     strategy: createTransactionEventhandler()
            // }
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);

        let result
        let message;
        if (fcn === "invoke") {
            console.log(args[0], args[1], args[2], args[3])
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], org_name);
            console.log(result)
            message = `Successfully added the asset with key ${args[0]} ${args[1]} ${args[2]}`

        } else if (fcn === "query") {
            console.log(args[0], args[1], args[2])
            let id = args[0] + "_" + args[1] + "_" + args[2]
            result = await contract.evaluateTransaction(fcn, id);
            console.log(result)
            message = `Successfully queried the asset with key ${id}`

        } else if (fcn === "history") {
            console.log(args[0], args[1], args[2])
            let id = args[0] + "_" + args[1] + "_" + args[2]
            result = await contract.evaluateTransaction(fcn, id);
            console.log(result)
            message = `Successfully queried history for the asset with key ${id}`

        } else if (fcn === "delete") {
            console.log(args[0], args[1], args[2])
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], org_name);
            console.log(result)
            message = `Successfully deleted the asset with key ${args[0]} ${args[1]} ${args[2]}`

        } else if (fcn === "update") {
            console.log(args[0], args[1], args[2], args[3])
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], org_name);
            console.log(result)
            message = `Successfully updated the asset with key ${args[0]} ${args[1]} ${args[2]}`

        } else if (fcn === "addChr") {
            console.log(args[0], args[1], args[2], args[3])
            result = await contract.submitTransaction(fcn, args[0], args[1], "CHR", args[2], args[3]);
            console.log(result)
            message = `Successfully added the asset with key ${args[0]} ${args[1]} for Aadhar No ${args[3]}`

        } else if (fcn === "qChr") {
            console.log(args[0])
            let id = args[0] + "_CHR"
            result = await contract.submitTransaction("query", id);
            console.log(result)
            message = `Successfully queried the asset with key ${id}`

        } else if (fcn === "hChr") {
            console.log(args[0])
            let id = args[0] + "_CHR"
            result = await contract.submitTransaction("history", id);
            console.log(result)
            message = `Successfully queried the asset history with key ${id}`

        } else if (fcn === "createPrivateCert") {
            console.log(args[0], args[1], args[2], args[3])
            result = await contract.submitTransaction(fcn, org_name, args[0], args[1], args[2], args[3]);
            console.log(result)
            message = `Successfully created the private data asset with key ${args[0] + "_" + args[1] + "_" + args[2]}`

        }
        else {
            return `Invocation function not found ${fcn}`
        }

        await gateway.disconnect();
        // console.log(result)
        if (!result.toString()) {
            result = "NIL";
        } else {

            // console.log("hello", result.toString())
            result = JSON.parse(result.toString());
            // console.log("hello", result)
        }


        let response = {
            message: message,
            result: result
        }
        // console.log("hello", response)
        return response;


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;