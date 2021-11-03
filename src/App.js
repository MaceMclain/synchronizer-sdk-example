import React, { useState, useEffect } from 'react'
import { DeusClient } from '@deusfinance/synchronizer-sdk'

/**
 * Currently, oracle2 and oracle3 don't support getDetails, this is only temporary and will be fixed with our new oracle system
 * However keep in mind that you still need 2 and 3 (or more!) for quotes + conducted + signatures
 */
const providers = [
  'https://oracle1.deus.finance',
  // 'https://oracle2.deus.finance',
  // 'https://oracle3.deus.finance',
]
const defaultChainId = 1
const minimumSignatures = 1

const Client = new DeusClient({
  providers: providers,
  chainId: defaultChainId,
  minimumSignatures: minimumSignatures,
})

function App() {
  const [signatureParams, setSignatureParams] = useState({})
  const [gmeDetails, setGmeDetails] = useState({})
  const [gmeContracts, setGmeContracts] = useState({})
  const [gmeQuote, setGmeQuote] = useState({})

  useEffect(() => {
    const fetchEverything = async () => {
      let methods = Client.getMethods()
      let constants = Client.constants
      let utils = Client.utils
      let functions = Client.functions

      let signatures = await Client.oracles.getSignatures()
      let details = await Client.oracles.getDetails()
      let conducted = await Client.oracles.getConducted()
      let quotes = await Client.oracles.getQuotes()

      // You can bind web3 chainId to this caller and build a poller / memo function
      console.log('You are using chainId 1 (mainnet), you can call Client.setChainId(new_chain_id) on chain switch for a multichain experience!');
      // Client.setChainId(137)

      console.log('Methods:');
      console.log(methods);

      console.log('Constants:');
      console.log(constants);

      console.log('Utils:');
      console.log(utils);

      console.log('Functions:');
      console.log(functions);

      console.log('Signatures:');
      console.log(signatures);

      console.log('Details:');
      console.log(details);
      setGmeDetails(details[0]['GME'])

      console.log('Conducted:');
      console.log(conducted);
      setGmeContracts(conducted['GME'])

      console.log('Quotes:');
      console.log(quotes);
      setGmeQuote(quotes['GME'])

      console.log('Processed signatures to buy from the GME Long contract on MAINNET:');
      const contract = '0x6db953ac7200139c4659f497d7d085c8fac5f7e9' // GME Long on chainId 1
      let result = Client.functions.prepareSignatureParams(
        signatures,
        contract,
        'buy',
      )
      console.log(result);

      setSignatureParams(result)
    }
    fetchEverything()
  }, [])

  return (
    <>
      <h1>Check the console for more outputs! However, the below shows everything you need to know about GME on MAINNET</h1>
      <h3>GME Details:</h3>
      <pre>{JSON.stringify(gmeDetails, undefined, 2)}</pre>
      <br/>

      <h3>GME Contracts: </h3>
      <p>'consensus' indicates that all nodes provided the same response and thus the results are considered 100% trustworthy.</p>
      <pre>{JSON.stringify(gmeContracts, undefined, 2)}</pre>
      <br/>

      <h3>GME Quote:</h3>
      <pre>{JSON.stringify(gmeQuote, undefined, 2)}</pre>
      <br/>

      <h3>Signature Params to pass into the smart contract:</h3>
      <p>You need a few more params to pass in the smart contract call, but those are out of scope for the SDK: <br/>https://github.com/deusfinance/synchronizer-contracts/blob/master/contracts/Synchronizer.sol#L121</p>
      <pre>{JSON.stringify(signatureParams, undefined, 2)}</pre>
    </>
  )
}

export default App;
