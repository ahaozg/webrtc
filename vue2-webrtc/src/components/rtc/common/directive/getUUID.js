/**
 * @function
 * @description  获取随机数
 * @returns {String} 随机数
 */
function getRandomForUUID() {
  // eslint-disable-next-line no-magic-numbers
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

/**
 * @function
 * @description  生成32位uuId
 * @returns {Object} 返回值
 */
function getUUID() {
  return (getRandomForUUID() +
        getRandomForUUID() +
        getRandomForUUID() +
        getRandomForUUID() +
        getRandomForUUID() +
        getRandomForUUID() +
        getRandomForUUID() +
        getRandomForUUID());
}

export default getUUID;
