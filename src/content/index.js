const PostMessageStream = require('post-message-stream')
const uuidv4 = require('uuid/v4')
const pageStream = new PostMessageStream({
  name: 'inpage',
  target: 'contentscript'
})
const CALLBACK_MAP = {}

const saveCallback = (callback) => {
  if (typeof callback !== 'function') return null
  const id = uuidv4()
  CALLBACK_MAP[id] = callback
  return id
}

const resolveCallback = (id, error, data) => {
  const callback = CALLBACK_MAP[id]
  if (typeof callback === 'function') {
    callback(error, data)
  }
}

let pendingPromise = {
  resolve: null,
  reject: null
}

pageStream.on('data', function ({
  status,
  error,
  data,
  callbackId
}) {
  if (callbackId) {
    return resolveCallback(callbackId, error, data)
  }
  const {
    resolve,
    reject
  } = pendingPromise
  if (resolve) {
    if (status === 'error') {
      reject(error)
    } else {
      resolve(data)
    }
    pendingPromise.resolve = null
    pendingPromise.reject = null
  }
})

const send = (action, data) => {
  // if (pendingPromise.resolve) {
  //   throw new Error('one task has already running')
  // }

  pendingPromise.resolve = null

  pageStream.write({
    from: 'page',
    action,
    data
  })

  return new Promise((resolve, reject) => {
    pendingPromise.resolve = resolve
    pendingPromise.reject = reject
  })
}

const formatValue = (value) => {
  value = value || 0
  return value * Math.pow(10, -8)
}

window.WiccWallet = {
  getDefaultAccount() {
    const promise = Promise.resolve()
    promise.then = function (callback, error) {
      const callbackId = saveCallback((err, data) => {
        callback(data)
      })
      send('getDefaultAccount', {
        callbackId,
      }).then(data => {
        if (data && data.locked)
          callback(data)
      }, err => {
        error(err)
      })
    }
    return promise
  },
  // getDefaultAccount() {
  //   return send('getDefaultAccount', {}).then((account) => {
  //     if (account.activeAccount === null) {
  //       throw new Error('Please create wallet or unlock wallet first')
  //     }

  //     return account
  //   })
  // },

  genCallContractRaw(destRegId, contract, value, callback) {
    const callbackId = saveCallback(callback)

    return send('openContractWindowRaw', {
      destRegId,
      contract,
      value: formatValue(value),
      callbackId,
      test: 1
    })
  },
  callContract(destRegId, contract, value, callback) {
    const callbackId = saveCallback(callback)

    return send('openContractWindow', {
      destRegId,
      contract,
      value: formatValue(value),
      callbackId
    })
  },

  publishContract(script, scriptDesc, callback) {
    const callbackId = saveCallback(callback)

    return send('publishContract', {
      script,
      scriptDesc,
      callbackId
    })
  },

  genPublishContractRaw(script, scriptDesc, callback) {
    const callbackId = saveCallback(callback)

    return send('publishContractRaw', {
      script,
      scriptDesc,
      callbackId,
      raw: 1
    })
  },

  requestPay(destAddress, value, desc, callback) {
    const callbackId = saveCallback(callback)

    return send('requestPay', {
      destAddress,
      value: formatValue(value),
      desc,
      callbackId
    })
  },

  ///??????
  CdpStake(assetMap,sCoinSymbol,scoinNum,cdpTxID,callback){
    const callbackId = saveCallback(callback)
    if (cdpTxID){
      return send('additionalCdpView', {
        wiccNum:assetMap[0].bCoinToStake,
        wusdNum:scoinNum,
        cdpTxId:cdpTxID,
        bcoinSymbol:assetMap[0].coinSymbol,
        scoinSymbol:sCoinSymbol,
        callbackId
      })
    }
    return send('createCdpView', {
      wiccNum:assetMap[0].bCoinToStake,
      wusdNum:scoinNum,
      bcoinSymbol:assetMap[0].coinSymbol,
      scoinSymbol:sCoinSymbol,
      callbackId
    })
  },
  ///??????
  CdpLiquidate(liquidateAssetSymbol,scoinsToLiquidate,cdpTxId,callback){
    const callbackId = saveCallback(callback)
    return send('liquidCdpView', {
      assetSymbol:liquidateAssetSymbol,
      wusdNum:scoinsToLiquidate,
      cdpTxId,
      callbackId
    })
  },
  ///??????
  CdpRedeem(assetMap,repayNum,cdpTxId,callback){
    const callbackId = saveCallback(callback)
    return send('redeemCdpView', {
      wusdNum:repayNum,
      wiccNum:assetMap[0].redeemCoinNum,
      redeemSymbol:assetMap[0].coinSymbol,
      cdpTxId,
      callbackId
    })
  },
  

  ///????????????  dealType : Limit_BUY / Limit_SELL
  DexLimit(dexTxType,coinType,assetType,amount,price,callback){
    const callbackId = saveCallback(callback)
    return send('dexView',{
      dealType:dexTxType,
      amount,
      limitPrice:price,
      coinType,assetType,
      callbackId
    })
  },

  ///????????????    dealType : Market_BUY / Market_SELL
  DexMarket(dexTxType,coinType,assetType,amount,callback){
    const callbackId = saveCallback(callback)
    return send('dexView',{
      dealType:dexTxType,
      amount,
      limitPrice:0,
      coinType,assetType,
      callbackId
    })
  },

  DexCancelOrder(dexTxNum,callback){
    const callbackId = saveCallback(callback)
    return send('dexCancelView',{
      dealNum:dexTxNum,
      callbackId
    })
  },

  ///????????????
  AssetIssue(assetSymbol,assetName,assetSupply,assetOwnerId,assetMintable,callback){
    const callbackId = saveCallback(callback)
    return send('AssetPub',{
      assetSymbol,
      assetName,
      assetSupply,
      assetOwnerId,
      assetMintable,
      callbackId
    })
  },

   ///????????????
   AssetUpdate(tokenSymbol,updateType,updateValue,callback){
    const callbackId = saveCallback(callback)
    return send('AssetUpadte',{
      assetSymbol:tokenSymbol,
      updateType,
      updateContent:updateValue,
      callbackId
    })
  },

  ///????????????
  SignMessage(imgUrl,appName,message,callback){
    const callbackId = saveCallback(callback)
    return send('signMessage',{
      imgUrl,appName,message,callbackId
    })
  },

    ///?????????????????????
    UCoinContractInvoke(amount,coinSymbol,appid,contractMethod,memo,callback,raw){
      const callbackId = saveCallback(callback)
      return send('walletPluginUContractInvoke',{
        amount,coinSymbol,regId:appid,contract:contractMethod,memo,callbackId,raw
      })
    },

    ///???????????????
    UCoinTransfer(assetMap,memo,callback,raw){
      const callbackId = saveCallback(callback)
      return send('UCoinTransfer',{
        assetMap,memo,callbackId,raw
      })
    },




















  genRequestPayRaw(destAddress, value, desc, callback) {
    const callbackId = saveCallback(callback)

    return send('requestPayRaw', {
      destAddress,
      value: formatValue(value),
      desc,
      callbackId,
      raw: 1
    })
  },

  requestVote(votes, callback) {
    const callbackId = saveCallback(callback)

    return send('requestVote', {
      votes,
      callbackId
    })
  },

  genVoteDelegateRaw(votes, callback) {
    const callbackId = saveCallback(callback)

    return send('requestVote', {
      votes,
      callbackId,
      raw: 1
    })
  }
}