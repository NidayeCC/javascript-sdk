const AV = require('./av');
const request = require('./request');

const initialize = (appId, appKey, masterKey) => {
  if (AV.applicationId && appId !== AV.applicationId && appKey !== AV.applicationKey && masterKey !== AV.masterKey) {
    console.warn('LeanCloud SDK is already initialized, please do not reinitialize it.');
  }
  AV.applicationId = appId;
  AV.applicationKey = appKey;
  AV.masterKey = masterKey;
  AV._useMasterKey = false;
};

const masterKeyWarn = () => {
  console.warn('MasterKey is not supposed to be used in browser.');
};

/**
  * Call this method first to set up your authentication tokens for AV.
  * You can get your app keys from the LeanCloud dashboard on http://leancloud.cn .
  * @function AV.init
  * @param {Object} options
  * @param {String} options.appId application id
  * @param {String} options.appKey application key
  * @param {String} options.masterKey application master key
*/

AV.init = (...args) => {
  switch (args.length) {
    case 1:
      const options = args[0];
      if (typeof options === 'object') {
        if (!AV._config.isNode && options.masterKey) {
          masterKeyWarn();
        }
        initialize(options.appId, options.appKey, options.masterKey);
        request.setServerUrlByRegion(options.region);
        AV._config.disableCurrentUser = options.disableCurrentUser;
      } else {
        throw new Error('AV.init(): Parameter is not correct.');
      }
    break;
    // 兼容旧版本的初始化方法
    case 2:
    case 3:
      console.warn('Please use AV.init() to replace AV.initialize(), ' +
       'AV.init() need an Object param, like { appId: \'YOUR_APP_ID\', appKey: \'YOUR_APP_KEY\' } . ' +
       'Docs: https://leancloud.cn/docs/sdk_setup-js.html');
      if (!AV._config.isNode && args.length === 3) {
        masterKeyWarn();
      }
      initialize(...args);
      request.setServerUrlByRegion('cn');
    break;
  }
};

// If we're running in node.js, allow using the master key.
if (AV._config.isNode) {
  AV.Cloud = AV.Cloud || {};
  /**
   * Switches the LeanCloud SDK to using the Master key.  The Master key grants
   * priveleged access to the data in LeanCloud and can be used to bypass ACLs and
   * other restrictions that are applied to the client SDKs.
   * <p><strong><em>Available in Cloud Code and Node.js only.</em></strong>
   * </p>
   */
  AV.Cloud.useMasterKey = function() {
    AV._useMasterKey = true;
  };
}

// 兼容老版本的初始化方法
AV.initialize = AV.init;
