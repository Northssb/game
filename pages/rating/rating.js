const QUESTIONS = [
  {
    id: "clear",
    type: "技能掌握",
    title: "高远球能否稳定打到对方后场？",
    options: [
      { label: "还不会完整发力", score: 0 },
      { label: "偶尔能到后场，但不稳定", score: 1 },
      { label: "大多数时候能到后场", score: 2 },
      { label: "能稳定控制落点和弧线", score: 3 },
    ],
  },
  {
    id: "smash",
    type: "技能掌握",
    title: "你对杀球的掌握更接近哪种情况？",
    options: [
      { label: "基本不会杀球", score: 0 },
      { label: "能杀球，但容易下网或出界", score: 1 },
      { label: "能把握机会完成进攻", score: 2 },
      { label: "能控制线路并衔接下一拍", score: 3 },
    ],
  },
  {
    id: "drop",
    type: "技能掌握",
    title: "劈吊、滑板等吊球变化掌握得怎样？",
    options: [
      { label: "没有接触过", score: 0 },
      { label: "知道动作，但实战很少成功", score: 1 },
      { label: "能完成基础劈吊", score: 2 },
      { label: "能根据站位使用劈吊或滑板变化", score: 3 },
    ],
  },
  {
    id: "backhand",
    type: "技能掌握",
    title: "被压到反手后场时，你通常能做到什么？",
    options: [
      { label: "经常接不到或只能勉强挡回", score: 0 },
      { label: "能回球，但质量不稳定", score: 1 },
      { label: "能用反手或头顶球回到底线", score: 2 },
      { label: "能主动选择直线、斜线或过渡球", score: 3 },
    ],
  },
  {
    id: "baseline_scene",
    type: "实战场景",
    title: "对方连续用高远球把你压在底线，你会优先怎么处理？",
    options: [
      { label: "每一拍都强行重杀，希望直接得分", score: 1 },
      { label: "站在原地等球落下来再回", score: 0 },
      { label: "提前移动到位，用高远球或吊球争取回位", score: 3 },
      { label: "不管来球高度，直接放网前", score: 1 },
    ],
  },
  {
    id: "doubles_scene",
    type: "实战场景",
    title: "双打接发时，对方发出质量一般的小球，你更倾向于？",
    options: [
      { label: "主动抢高点推扑或放网，争取进攻", score: 3 },
      { label: "习惯挑到对方后场，把进攻让给对方", score: 1 },
      { label: "等球落到腰部以下再击球", score: 0 },
      { label: "直接大力杀球，不考虑击球点", score: 1 },
    ],
  },
];

Page({
  data: {
    levelOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    selfLevelIndex: 3,
    selfLevel: 4,
    questions: QUESTIONS,
    answers: {},
    answeredCount: 0,
    result: null,
  },

  selectSelfLevel(event) {
    const selfLevelIndex = Number(event.detail.value);
    this.setData({
      selfLevelIndex,
      selfLevel: this.data.levelOptions[selfLevelIndex],
      result: null,
    });
  },

  answerQuestion(event) {
    const questionId = event.currentTarget.dataset.questionId;
    const optionIndex = Number(event.detail.value);
    const answers = { ...this.data.answers, [questionId]: optionIndex };
    this.setData({
      answers,
      answeredCount: Object.keys(answers).length,
      result: null,
    });
  },

  submitAssessment() {
    if (this.data.answeredCount !== QUESTIONS.length) {
      wx.showToast({
        title: `还有 ${QUESTIONS.length - this.data.answeredCount} 题未完成`,
        icon: "none",
      });
      return;
    }

    let score = 0;
    let maxScore = 0;
    QUESTIONS.forEach((question) => {
      const selectedIndex = this.data.answers[question.id];
      score += question.options[selectedIndex].score;
      maxScore += Math.max(...question.options.map((option) => option.score));
    });
    const assessmentLevel = Math.round((1 + (score / maxScore) * 8) * 2) / 2;
    const result = {
      selfLevel: this.data.selfLevel,
      assessmentLevel,
      score,
      maxScore,
      completedAt: new Date().toISOString(),
    };
    wx.setStorageSync("ratingResult", result);
    this.setData({ result });
    wx.pageScrollTo({ scrollTop: 0, duration: 300 });
  },
});
