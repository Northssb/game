const { games, profile } = require("../../data/mock-data");
const {
  canViewContact,
  getRecruitmentSummary,
} = require("../../utils/game-rules");

const DEMO_JOINED = [
  { gameId: "mens-single-futian-01", status: "approved" },
  { gameId: "womens-double-baoan-01", status: "pending" },
];

function buildDemoOrganizedGame() {
  const base = games[0];
  return {
    ...base,
    id: "organizer-demo-01",
    title: "南山混双补位",
    organizer: {
      name: profile.name,
      initial: profile.initial,
      attendanceRate: profile.attendanceRate,
      completedCount: profile.completedCount,
      historicalNoShows: profile.historicalNoShows,
    },
    joinedCount: 2,
    targetCount: 4,
    pendingCount: 1,
    status: "recruiting",
    applicants: [
      {
        id: "applicant-su",
        name: "苏澈",
        initial: "苏",
        level: 4,
        assessmentLevel: 4,
        completedCount: 18,
        attendanceRate: 100,
        historicalNoShows: 0,
        contact: "微信：suche_play",
        status: "pending",
      },
    ],
  };
}

Page({
  data: {
    selectedTab: "joined",
    joinedGames: [],
    organizedGames: [],
  },

  onShow() {
    this.loadGames();
  },

  selectTab(event) {
    this.setData({ selectedTab: event.currentTarget.dataset.value });
  },

  loadGames() {
    const storedApplications = wx.getStorageSync("applications") || [];
    const overrides = wx.getStorageSync("myGameOverrides") || {};
    const joinedByGameId = new Map();
    DEMO_JOINED.forEach((item) => joinedByGameId.set(item.gameId, item));
    storedApplications.forEach((item) => joinedByGameId.set(item.gameId, item));

    const joinedGames = Array.from(joinedByGameId.values())
      .filter((item) => !overrides[item.gameId] || !overrides[item.gameId].hidden)
      .map((item) => {
        const game = games.find((candidate) => candidate.id === item.gameId);
        if (!game) {
          return null;
        }
        const status = overrides[item.gameId]
          ? overrides[item.gameId].status
          : item.status;
        return this.decorateJoinedGame(game, status);
      })
      .filter(Boolean);

    let demoOrganized = wx.getStorageSync("organizerDemo");
    if (!demoOrganized) {
      demoOrganized = buildDemoOrganizedGame();
      wx.setStorageSync("organizerDemo", demoOrganized);
    }
    const createdGames = wx.getStorageSync("createdGames") || [];
    const organizedGames = [demoOrganized, ...createdGames].map((game) =>
      this.decorateOrganizedGame(game),
    );

    this.setData({ joinedGames, organizedGames });
  },

  decorateJoinedGame(game, status) {
    const summary = getRecruitmentSummary(game);
    const statusMap = {
      pending: { label: "待组织者审核", tone: "status-waiting" },
      approved: { label: "已加入", tone: "status-success" },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return {
      ...game,
      ...summary,
      participationStatus: status,
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone,
      showCancelButton: status === "pending" || status === "approved",
      contactVisible: canViewContact({
        applicationStatus: status,
        endAt: game.endAt,
        now: new Date().toISOString(),
      }),
    };
  },

  decorateOrganizedGame(game) {
    const summary = getRecruitmentSummary(game);
    const applicants = (game.applicants || []).map((applicant) => ({
      ...applicant,
      statusLabel:
        applicant.status === "approved"
          ? "已通过"
          : applicant.status === "rejected"
            ? "已拒绝"
            : "待审核",
      contactVisible: applicant.status === "approved",
      actionable: applicant.status === "pending",
    }));
    return {
      ...game,
      ...summary,
      applicants,
      statusLabel:
        game.joinedCount >= game.targetCount ? "已满员" : "招募中",
    };
  },

  cancelParticipation(event) {
    const gameId = event.currentTarget.dataset.id;
    const game = this.data.joinedGames.find((item) => item.id === gameId);
    wx.showModal({
      title: "退出这个球局？",
      content: "退出后将不再显示该球局。如果双方已经在线下约定，后续争议仍需通过图片证据提交管理员审核。",
      confirmText: "退出",
      confirmColor: "#d65d4a",
      success: (result) => {
        if (!result.confirm) {
          return;
        }
        const overrides = wx.getStorageSync("myGameOverrides") || {};
        overrides[gameId] = {
          status: game.participationStatus,
          hidden: true,
        };
        wx.setStorageSync("myGameOverrides", overrides);
        this.loadGames();
        wx.showToast({ title: "已退出", icon: "success" });
      },
    });
  },

  copyContact(event) {
    const game = this.data.joinedGames.find(
      (item) => item.id === event.currentTarget.dataset.id,
    );
    if (game && game.contactVisible) {
      wx.setClipboardData({ data: game.organizer.contact });
    }
  },

  reviewApplicant(event) {
    const gameId = event.currentTarget.dataset.gameId;
    const applicantId = event.currentTarget.dataset.applicantId;
    const action = event.currentTarget.dataset.action;
    const demo = wx.getStorageSync("organizerDemo") || buildDemoOrganizedGame();
    if (demo.id !== gameId) {
      return;
    }
    const applicant = demo.applicants.find((item) => item.id === applicantId);
    if (!applicant || applicant.status !== "pending") {
      return;
    }

    applicant.status = action === "approve" ? "approved" : "rejected";
    demo.pendingCount = Math.max(0, demo.pendingCount - 1);
    if (action === "approve") {
      demo.joinedCount += 1;
    }
    wx.setStorageSync("organizerDemo", demo);
    this.loadGames();
    wx.showToast({
      title: action === "approve" ? "已通过申请" : "已拒绝申请",
      icon: "success",
    });
  },
});
