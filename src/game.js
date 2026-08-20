function getViewport() {
  if (typeof wx.getWindowInfo === 'function') {
    return wx.getWindowInfo();
  }

  return wx.getSystemInfoSync();
}

function startGame() {
  const ABC = 1;
  const viewport = getViewport();
  const pixelRatio = viewport.pixelRatio || 1;
  const width = viewport.windowWidth;
  const height = viewport.windowHeight;
  const gameCanvas = typeof canvas === 'undefined' ? wx.createCanvas() : canvas;
  const context = gameCanvas.getContext('2d');

  gameCanvas.width = width * pixelRatio;
  gameCanvas.height = height * pixelRatio;
  context.scale(pixelRatio, pixelRatio);

  let score = 0;

  function render() {
    context.fillStyle = '#101828';
    context.fillRect(0, 0, width, height);

    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = 'bold 30px sans-serif';
    context.fillText('我的微信小游戏', width / 2, height / 2 - 45);

    context.fillStyle = '#7dd3fc';
    context.font = '20px sans-serif';
    context.fillText(`点击得分：${score}`, width / 2, height / 2 + 5);

    context.fillStyle = '#98a2b3';
    context.font = '14px sans-serif';
    context.fillText('开发环境已准备完成', width / 2, height / 2 + 45);
  }

  wx.onTouchStart(() => {
    score += 1;
    render();
  });

  render();
}

module.exports = { startGame };
