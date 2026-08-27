const { games } = require("../../data/mock-data");
const {
  canViewContact,
  getRecruitmentSummary,
} = require("../../utils/game-rules");

Page({
  data: {
    game: null,
    applicationStatus: "none",
    applicationLabel: "申请加入",
    canViewContact: false,
  },

  onLoad(options) {
    this.gameId = options.id;
    this.loadGame();
  },

  onShow() {
    if (this.gameId) {
      this.loadApplicationStatus();
    }
  },

  loadGame() {
    const game = games.find((item) => item.id === this.gameId);
    if (!game) {
      wx.showToast({ title: "球局不存在或已结束", icon: "none" });
      setTimeout(() => wx.navigateBack(), 500);
      return;
    }

    const summary = getRecruitmentSummary(game);
    const members = game.members.map((initial, index) => ({
      initial,
      name: index === 0 ? game.organizer.name : `球友 ${initial}`,
      role: index === 0 ? "组织者" : "已加入",
    }));
    this.setData({
      game: {
        ...game,
        ...summary,
        members,
        levelText: `中羽 ${game.minLevel}-${game.maxLevel} 级`,
      },
    });
    this.loadApplicationStatus();
  },

  loadApplicationStatus() {
    if (!this.data.game) {
      return;
    }
    const applications = wx.getStorageSync("applications") || [];
    const application = applications.find((item) => item.gameId === this.gameId);
    const applicationStatus = application ? application.status : "none";
    const labels = {
      none: "申请加入",
      pending: "已申请，等待审核",
      approved: "已加入球局",
    };
    this.setData({
      applicationStatus,
      applicationLabel: labels[applicationStatus] || "查看申请",
      canViewContact: canViewContact({
        applicationStatus,
        endAt: this.data.game.endAt,
        now: new Date().toISOString(),
      }),
    });
  },

  applyToGame() {
    if (this.data.applicationStatus !== "none") {
      wx.switchTab({ url: "/pages/my-games/my-games" });
      return;
    }

    wx.showModal({
      title: "申请加入这个球局？",
      content: "组织者审核通过后才会显示双方联系方式。提交后可在“我的球局”查看审核结果。",
      confirmText: "提交申请",
      success: (result) => {
        if (!result.confirm) {
          return;
        }
        const applications = wx.getStorageSync("applications") || [];
        wx.setStorageSync("applications", [
          ...applications.filter((item) => item.gameId !== this.gameId),
          {
            gameId: this.gameId,
            status: "pending",
            appliedAt: new Date().toISOString(),
          },
        ]);
        this.loadApplicationStatus();
        wx.showToast({ title: "申请已提交", icon: "success" });
      },
    });
  },

  copyContact() {
    if (!this.data.canViewContact) {
      return;
    }
    wx.setClipboardData({ data: this.data.game.organizer.contact });
  },
});
