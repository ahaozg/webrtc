/**
 *@file calcGrid2
 *@version 1.0.0
 *@author haozg
 *@createTime 2022/06/14
 *@updateTime 2020/06/14
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description 计算宫格行列，突出主体C位，最多10个。演讲者视图
 */
const cellGapNum = 10;
const surroundingNum = 16;

/**
 * 计算宫格行列
 * @param {Array} array 格子数字
 * @param {Object} rect 外层容器的位置信息
 * @param {number} cellGap 格子之间的间隔
 * @param {Object} surroundObj 容器和盒子直接的间隔
 * @return {null|{wrapWidth,cellWidth:number,contentWidth:number, wrapHeight, totalCols: number, cellHeight: number, positions: *[], totalRows: number, howMany: number, contentHeight: number}} 宫格信息
 */
function calcGrid2(array, rect, cellGap = cellGapNum, surroundObj = {
  top: surroundingNum,
  left: surroundingNum,
  right: surroundingNum,
  bottom: surroundingNum,
}) {
  const half = 2;
  const proportionX = 16;
  const proportionY = 9;
  if (!array) {
    return null;
  }
  const originalLength = array.length;
  if (originalLength === 0) {
    return null;
  }
  // eslint-disable-next-line no-magic-numbers
  if (originalLength > 10) {
    // eslint-disable-next-line no-throw-literal
    throw '至多10位人员';
  }
  // 宫格计算所需要的长度
  const length = transitionArrayLength(array);
  // 计算这些格子应该放在几宫格之内
  // 几宫格
  const howMany = Math.ceil(Math.sqrt(length));
  // 总行数
  const totalRows = Math.ceil(length / howMany);
  // 总列数
  const totalCols = Math.min(howMany, length);

  // 容器宽高
  const wrapWidth = rect.width;
  const wrapHeight = rect.height;

  // 排除容器与格子的间隔
  const contentWidth = wrapWidth - surroundObj.left - surroundObj.right;
  const contentHeight = wrapHeight - surroundObj.top - surroundObj.bottom;

  // 先以宽度为准，计算大小
  // 每一个小格子的宽度1
  let itemW = Math.floor((contentWidth + cellGap) / totalCols - cellGap);
  // 根据比例计算小格子的高度1
  let itemH = Math.floor(itemW * proportionY / proportionX);
  // 几个格子加起来大于总高度
  if ((itemH * totalRows) > contentHeight) {
    // 再以高度为准，计算大小
    // 每一个小格子的高度2
    // itemH = Math.floor((contentHeight + cellGap) / totalRows - cellGap);
    // 根据比例计算小格子的高度2
    // itemW = Math.floor(itemH * proportionX / proportionY);
    // 因为直播是1920*1080，所有只有宽度为准，不然会议名签再会议画面中会随页面宽度变化
    // 根据高度计算出宽度，再计算每个格子宽高
    const newWidth = contentHeight * proportionX / proportionY;
    itemW = Math.floor((newWidth + cellGap) / totalCols - cellGap);
    itemH = Math.floor(itemW * proportionY / proportionX);
  }

  // 计算位置
  // 竖向盒子加起来的总高度
  const verticalH = totalRows * (itemH + cellGap) - cellGap;
  // 横向盒子加起来的总宽度
  const horizonW = totalCols * (itemW + cellGap) - cellGap;
  const baseTop = Math.max(Math.floor((wrapHeight - verticalH) / half), surroundObj.top);
  const baseLeft = Math.max(Math.floor((wrapWidth - horizonW) / half), surroundObj.left);
  let top = 0;
  let left = 0;
  // 存储格子位置信息
  const positions = [];
  // 最后一行余几个
  const remainder = length % totalCols;
  // 最后一行横向盒子加起来的总宽度
  const horizonWLastRow = remainder * (itemW + cellGap) - cellGap;
  const baseLeftLastRow = remainder ? (Math.floor((contentWidth - horizonWLastRow) / half) + surroundObj.left) : baseLeft;
  // 设置位置信息
  for (let index = 0; index < length; index++) {
    // 行号
    const x = Math.floor(index / totalCols);
    top = baseTop + x * (itemH + cellGap);
    // 列号
    const y = Math.floor(index % totalCols);
    // 到最后一行的余数位置，有余数则需要居中,居中需要调整left
    if (remainder && length - index <= remainder) {
      left = baseLeftLastRow + y * (itemW + cellGap);
    } else {
      left = baseLeft + y * (itemW + cellGap);
    }
    positions.push({
      top,
      left,
      cellWidth: itemW,
      cellHeight: itemH,
    });
  }
  // 将位置信息放到源数组中
  mergeArray(array, positions);
  // 只有一个充满全屏
  if (array.length === 1) {
    const {
      top: oldTop,
      left: oldLeft,
      cellWidth,
      cellHeight,
    } = array[0].positions;
    array[0].positions.top = 0;
    array[0].positions.left = 0;
    array[0].positions.cellWidth = cellWidth + oldLeft + oldLeft;
    array[0].positions.cellHeight = cellHeight + oldTop + oldTop;
  }
  return {
    calcGridName: 'calcGrid2',
    howMany,
    totalRows,
    totalCols,
    wrapWidth,
    wrapHeight,
    contentWidth,
    contentHeight,
    cellWidth: itemW,
    cellHeight: itemH,
    positions,
  };
}

/**
 * 转换数组长度，先等分盒子，再给C位C位特殊处理，占16份或者一整份
 * @param {Array} array 人员数组
 * @return {Number} 新长度
 */
function transitionArrayLength(array) {
  const length = array.length;
  if (length === 1) {
    return 1;
    // eslint-disable-next-line no-magic-numbers
  } else if (length > 1 && length <= 5) {
    // eslint-disable-next-line no-magic-numbers
    return 20;
  }
  // eslint-disable-next-line no-magic-numbers
  return 25;
}

/**
 * 融合数组，将b中的信息提取后加入a中
 * @param {Array} a 数组
 * @param {Array} b 数组
 * @return {void}
 */
function mergeArray(a, b) {
  const aLength = a.length;
  const bLength = b.length;
  if (bLength === 1) {
    a[0].positions = b[0];
  } else {
    // 设置主C坐标
    a[0].positions = {
      top: b[0].top,
      left: b[0].left,
      // eslint-disable-next-line no-magic-numbers
      cellWidth: b[18].left - b[0].left + b[18].cellWidth,
      // eslint-disable-next-line no-magic-numbers
      cellHeight: b[18].top - b[0].top + b[18].cellHeight,
    };
    // 设置其余几个位置信息
    for (let i = 1; i < aLength; i++) {
      // eslint-disable-next-line no-magic-numbers
      if (i < 5) {
        // 第2个人到第五个人
        // eslint-disable-next-line no-magic-numbers
        a[i].positions = b[i * 5 - 1];
      } else {
        // 第6个人到第10个人
        // eslint-disable-next-line no-magic-numbers
        a[i].positions = b[15 + i];
      }
    }
  }
}

export default calcGrid2;
