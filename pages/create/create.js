const { profile } = require("../../data/mock-data");

function pad(value) {
  return String(value).padStart(2, "0");
}

function defaultDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

Page({
  data: {
    title: "",
    typeOptions: ["男单", "女单", "男双", "女双", "混双"],
    selectedType: "混双",
    date: defaultDate(),
    time: "19:00",
    districtOptions: ["南山区", "福田区", "宝安区", "龙岗区", "罗湖区", "龙华区"],
    selectedDistrictIndex: 0,
    selectedDistrict: "南山区",
    targetOptions: [2, 4, 6, 8, 10, 12],
    selectedTargetIndex: 1,
    targetCount: 4,
    levelOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    minLevelIndex: 2,
    maxLevelIndex: 4,
    minLevel: 3,
    maxLevel: 5,
    note: "",
    submitting: false,
  },

  selectType(event) {
    this.setData({ selectedType: event.currentTarget.dataset.value });
  },

  updateTitle(event) {
    this.setData({ title: event.detail.value });
  },

  updateNote(event) {
    this.setData({ note: event.detail.value });
  },

  selectDate(event) {
    this.setData({ date: event.detail.value });
  },

  selectTime(event) {
    this.setData({ time: event.detail.value });
  },

  selectDistrict(event) {
    const selectedDistrictIndex = Number(event.detail.value);
    this.setData({
      selectedDistrictIndex,
      selectedDistrict: this.data.districtOptions[selectedDistrictIndex],
    });
  },

  selectTarget(event) {
    const selectedTargetIndex = Number(event.detail.value);
    this.setData({
      selectedTargetIndex,
      targetCount: this.data.targetOptions[selectedTargetIndex],
    });
  },

  selectMinLevel(event) {
    const minLevelIndex = Number(event.detail.value);
    this.setData({
      minLevelIndex,
      minLevel: this.data.levelOptions[minLevelIndex],
    });
  },

  selectMaxLevel(event) {
    const maxLevelIndex = Number(event.detail.value);
    this.setData({
      maxLevelIndex,
      maxLevel: this.data.levelOptions[maxLevelIndex],
    });
  },

  publishGame() {
    if (this.data.minLevel > this.data.maxLevel) {
      wx.showToast({ title: "最低等级不能高于最高等级", icon: "none" });
      return;
    }

    const start = new Date(`${this.data.date}T${this.data.time}:00+08:00`);
    if (!Number.isFinite(start.getTime()) || start.getTime() <= Date.now()) {
      wx.showToast({ title: "请选择未来的球局时间", icon: "none" });
      return;
    }

    this.setData({ submitting: true });
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const title = this.data.title.trim() || `${this.data.selectedType}约球`;
    const game = {
      id: `created-${Date.now()}`,
      title,
      type: this.data.selectedType,
      city: "深圳市",
      district: this.data.selectedDistrict,
      areaHint: "具体球馆审核通过后线下商定",
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      dateLabel: `${start.getMonth() + 1}月${start.getDate()}日`,
      timeLabel: `${pad(start.getHours())}:${pad(start.getMinutes())}-${pad(end.getHours())}:${pad(end.getMinutes())}`,
      targetCount: this.data.targetCount,
      joinedCount: 1,
      pendingCount: 0,
      minLevel: this.data.minLevel,
      maxLevel: this.data.maxLevel,
      status: "recruiting",
      note: this.data.note.trim() || "审核通过后联系，场地和费用线下商量。",
      organizer: {
        name: profile.name,
        initial: profile.initial,
        completedCount: profile.completedCount,
        attendanceRate: profile.attendanceRate,
        historicalNoShows: profile.historicalNoShows,
      },
      applicants: [],
      createdAt: new Date().toISOString(),
    };
    const createdGames = wx.getStorageSync("createdGames") || [];
    wx.setStorageSync("createdGames", [game, ...createdGames]);

    wx.showToast({ title: "球局已发布", icon: "success" });
    setTimeout(() => {
      this.setData({ submitting: false });
      wx.switchTab({ url: "/pages/my-games/my-games" });
    }, 500);
  },
});
