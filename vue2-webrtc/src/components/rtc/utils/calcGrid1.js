/**
 *@file calcGrid1
 *@version 1.0.0
 *@author haozg
 *@createTime 2022/02/19
 *@updateTime 2020/02/19
 *@see [jsDoc中文文档]{@link  http://www.dba.cn/book/jsdoc/JSDOCKuaiBiaoQianBLOCKTAGS/CONSTRUCTS.html}
 @description 计算宫格行列
 */
const cellGapNum = 10;
const surroundingNum = 16;

/**
 * 计算宫格行列
 * @param {Array} array 格子数字
 * @param {Object} rect 外层容器的位置信息
 * @param {number} cellGap 格子之间的间隔
 * @param {Object} surroundObj 容器和盒子直接的间隔
 * @return {null|{wrapWidth,cellWidth:number,contentWidth: number, wrapHeight, totalCols: number, cellHeight: number, positions: *[], totalRows: number, howMany: number, contentHeight: number}} 宫格信息
 */
function calcGrid1(array, rect, cellGap = cellGapNum, surroundObj = {
  top: surroundingNum,
  left: surroundingNum,
  right: surroundingNum,
  bottom: surroundingNum,
}) {
  const half = 2;
  // const two = 2;
  const proportionX = 16;
  const proportionY = 9;
  if (!array) {
    return null;
  }
  const length = array.length;
  if (length === 0) {
    return null;
  }
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
    // // 每一个小格子的高度2
    // itemH = Math.floor((contentHeight + cellGap) / totalRows - cellGap);
    // // 根据比例计算小格子的高度2
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
  array.forEach((item, index) => {
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
    // 注入到传入的数组中
    item.positions = {
      top,
      left,
      cellWidth: itemW,
      cellHeight: itemH,
    };
  });
  // // 只有一个充满全屏
  // if (array.length === 1) {
  //   const {
  //     top: oldTop,
  //     left: oldLeft,
  //     cellWidth,
  //     cellHeight,
  //   } = array[0].positions;
  //   array[0].positions.top = 0;
  //   array[0].positions.left = 0;
  //   array[0].positions.cellWidth = cellWidth + oldLeft + oldLeft;
  //   array[0].positions.cellHeight = cellHeight + oldTop + oldTop;
  // }
  return {
    calcGridName: 'calcGrid1',
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

export default calcGrid1;
