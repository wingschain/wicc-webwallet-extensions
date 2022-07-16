import wallet from './wallet/index'

const TYPE_PATH_MAP = {
  contract: '/window/contract',
  publicContract: '/window/publish-contract',
  requestPay: '/window/request-pay',
  requestVote: '/window/request-vote',
  login: '/window/login',
  walletCreate: '/',
  requestMyTest: '/window/request-my',
  createCdpView: '/window/cdp-create',
  liquidCdpView: '/window/cdp-liquid',
  redeemCdpView: '/window/cdp-redeem',
  additionalCdpView: '/window/cdp-additional',
  dexView: '/window/dex-dealView',
  dexCancelView: '/window/dex-cancel-dealView',
  AssetPub:'/window/assets-pub',
  AssetUpadte:'/window/assets-update',
  signMessage:'/window/message-sign',
  UContractInvoke:'/window/contract-new',
  UCoinTransfer:'/window/windowSend'
}

const getQueryString = (args) => {
  let result = []
  Object.keys(args).forEach((key) => {
    const value = args[key]
    let valueString
    if (typeof value === 'object') {
      valueString = encodeURIComponent(JSON.stringify(value))
    } else {
      if (key === 'script') {
        valueString = encodeURIComponent(encodeURI(value));
      } else {
        valueString = encodeURIComponent(value);
      }
    }
    result.push(key + '=' + valueString)
  })
  return result.join('&')
}

const ua = navigator.userAgent.toLowerCase()
const deltaHeight = ua.indexOf("mac os") > -1 ? 34 : ua.indexOf("firefox") ? 40 : 36

const openWindow = async (type, args) => {
  const path = TYPE_PATH_MAP[type]
  const queryString = getQueryString(args)
  const popupURL = chrome.extension.getURL(`pages/popup.html#${path}?${queryString}`)
  return chrome.windows.create({
    url: popupURL,
    type: 'popup',
    height: 600 + deltaHeight,
    width: 376
  })
}

export default {
  async getDefaultAccount({
    callbackId,
  }) {
    const state = await wallet.getState()

    if (!state.vaultCreated) {
      openWindow('walletCreate', {
        getDefaultAccount: 1,
        callbackId
      })
      throw new Error('Please create wallet first')
    }

    if (state.isLocked) {
      return openWindow('login', {
        getDefaultAccount: 1,
        callbackId
      })
    }
    return wallet.getDefaultAccount().then(account => ({
      ...account,
      locked: 1
    }))
  },

  async openWindow() {
    const popupURL = chrome.extension.getURL('pages/popup.html#/window/contract')

    return chrome.windows.create({
      url: popupURL,
      type: 'popup',
      height: 600 + deltaHeight,
      width: 376
    })
  },

  async openContractWindow({
    destRegId,
    contract,
    value,
    callbackId
  }) {
    return openWindow('contract', {
      destRegId,
      contract,
      value,
      callbackId
    })
  },

  async openContractWindowRaw({
    destRegId,
    contract,
    value,
    callbackId,
    test
  }) {
    return openWindow('contract', {
      destRegId,
      contract,
      value,
      callbackId,
      test
    })
  },

  async publishContract({
    script,
    scriptDesc,
    callbackId
  }) {
    return openWindow('publicContract', {
      script,
      scriptDesc,
      callbackId
    })
  },

  async publishContractRaw({
    script,
    scriptDesc,
    callbackId,
    raw
  }) {
    return openWindow('publicContract', {
      script,
      scriptDesc,
      callbackId,
      raw
    })
  },

  async requestPay({
    destAddress,
    value,
    desc,
    callbackId
  }) {
    return openWindow('requestPay', {
      destAddress,
      value,
      desc,
      callbackId
    })
  },

  /**
   cdp  pop 界面 
   */
  async createCdpView({ wiccNum, wusdNum, bcoinSymbol,scoinSymbol, callbackId }) {
    return openWindow('createCdpView', {
      wiccNum, wusdNum,
      bcoinSymbol,
      scoinSymbol,
    
      callbackId,
    })
  },
  async additionalCdpView({ wiccNum, wusdNum, cdpTxId,bcoinSymbol,scoinSymbol, callbackId }) {
    return openWindow('additionalCdpView', {
      wiccNum, wusdNum, cdpTxId, bcoinSymbol,scoinSymbol,callbackId
    })
  },
  async liquidCdpView({ wusdNum, cdpTxId, callbackId, }) {
    return openWindow('liquidCdpView', {
      wusdNum, cdpTxId,callbackId
    })
  },
  async redeemCdpView({ wusdNum, wiccNum,redeemSymbol, cdpTxId ,callbackId }) {
    return openWindow('redeemCdpView', {
      wusdNum, wiccNum,redeemSymbol, cdpTxId,callbackId
    })
  },
  async dexView({ dealType, amount, limitPrice, coinType,assetType,callbackId }) {
    return openWindow('dexView', {
      dealType, amount, limitPrice,  coinType,assetType,callbackId
    })
  },

  async dexCancelView({ dealNum,callbackId }) {
    return openWindow('dexCancelView', {
      dealNum,callbackId
    })
  },
  

  async AssetPub({ assetSymbol,assetName,assetSupply,assetOwnerId,assetMintable,callbackId }) {
    return openWindow('AssetPub', {
      assetSymbol,assetName,assetSupply,assetOwnerId,assetMintable,callbackId
    })
  },

  async AssetUpadte({ assetSymbol,updateType,updateContent,callbackId }) {
    return openWindow('AssetUpadte', {
      assetSymbol,updateType,updateContent,callbackId
    })
  },

  async signMessage({ imgUrl,appName,message,callbackId }) {
    return openWindow('signMessage', {
      imgUrl,appName,message,callbackId
    })
  },
  

  async walletPluginUContractInvoke({ amount,coinSymbol,regId,contract,memo,callbackId,raw}) {
    return openWindow('UContractInvoke', {
      amount,coinSymbol,regId,contract,memo,callbackId,raw
    })
  },

  async UCoinTransfer({ assetMap,memo,callbackId,raw }) {
    return openWindow('UCoinTransfer', {
      assetMap,memo,callbackId,raw
    })
  },








  async requestPayRaw({
    destAddress,
    value,
    desc,
    callbackId,
    raw
  }) {
    return openWindow('requestPay', {
      destAddress,
      value,
      desc,
      callbackId,
      raw
    })
  },

  async requestVote({
    votes,
    callbackId
  }) {
    return openWindow('requestVote', {
      votes,
      callbackId
    })
  },

  async requestVoteRaw({
    votes,
    callbackId,
    raw
  }) {
    return openWindow('requestVote', {
      votes,
      callbackId,
      raw
    })
  },
  handleMessage(action, data) {
    data = data || {}
    return new Promise(async (resolve, reject) => {
      const state = await wallet.getState()
      if (!state.vaultCreated) {
        reject(new Error('Please create wallet first'))
      } else if (typeof this[action] === 'function') {
        this[action](data).then(resolve, reject)
      } else {
        reject(new Error('unknown action ' + action))
      }
    })
  }
}