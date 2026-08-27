const { games } = require("../../data/mock-data");
const {
  filterGames,
  getRecruitmentSummary,
  recommendGame,
} = require("../../utils/game-rules");

const TYPE_CLASS = {
  男单: "type-blue",
  女单: "type-rose",
  男双: "type-violet",
  女双: "type-orange",
  混双: "type-green",
};

Page({
  data: {
    city: "深圳市",
    userLevel: 4,
    dateOptions: ["全部日期", "今天", "明天", "本周"],
    selectedDate: "全部日期",
    districtOptions: ["全部区域", "南山区", "福田区", "宝安区", "龙岗区"],
    selectedDistrictIndex: 0,
    selectedDistrict: "全部区域",
    typeOptions: ["全部", "男单", "女单", "男双", "女双", "混双"],
    selectedType: "全部",
    visibleGames: [],
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: "羽球搭子" });
    this.applyFilters();
  },

  onShow() {
    this.applyFilters();
  },

  selectDate(event) {
    this.setData({ selectedDate: event.currentTarget.dataset.value }, () => {
      this.applyFilters();
    });
  },

  selectType(event) {
    this.setData({ selectedType: event.currentTarget.dataset.value }, () => {
      this.applyFilters();
    });
  },

  selectDistrict(event) {
    const selectedDistrictIndex = Number(event.detail.value);
    this.setData(
      {
        selectedDistrictIndex,
        selectedDistrict: this.data.districtOptions[selectedDistrictIndex],
      },
      () => this.applyFilters(),
    );
  },

  resetFilters() {
    this.setData(
      {
        selectedDate: "全部日期",
        selectedDistrictIndex: 0,
        selectedDistrict: "全部区域",
        selectedType: "全部",
      },
      () => this.applyFilters(),
    );
  },

  applyFilters() {
    const filteredByRules = filterGames(games, {
      city: this.data.city,
      district: this.data.selectedDistrict,
      type: this.data.selectedType,
      level: this.data.userLevel,
    });
    const filteredByDate = filteredByRules.filter(
      (game) =>
        this.data.selectedDate === "全部日期" ||
        game.dayCategory === this.data.selectedDate,
    );
    this.currentFilteredGames = filteredByDate;
    this.setData({
      visibleGames: filteredByDate.map((game) => this.decorateGame(game)),
    });
  },

  decorateGame(game) {
    const summary = getRecruitmentSummary(game);
    return {
      ...game,
      ...summary,
      typeClass: TYPE_CLASS[game.type] || "type-green",
      levelText: `中羽 ${game.minLevel}-${game.maxLevel} 级`,
      creditText: `履约 ${game.organizer.attendanceRate}% · 已打 ${game.organizer.completedCount} 场`,
      showNoShowBadge: game.organizer.historicalNoShows > 0,
    };
  },

  quickMatch() {
    const recommended = recommendGame(this.currentFilteredGames || [], {
      city: this.data.city,
      district: this.data.selectedDistrict,
      type: this.data.selectedType,
      level: this.data.userLevel,
    });

    if (!recommended) {
      wx.showModal({
        title: "暂时没有合适球局",
        content: "可以放宽区域或球局类型后再试，也可以自己发布一个球局。",
        confirmText: "去发布",
        success: (result) => {
          if (result.confirm) {
            wx.switchTab({ url: "/pages/create/create" });
          }
        },
      });
      return;
    }

    const summary = getRecruitmentSummary(recommended);
    wx.showModal({
      title: "为你找到一个球局",
      content: `${recommended.type} · ${recommended.district}\n${recommended.dateLabel} ${recommended.timeLabel}\n${summary.fillTag}，适合中羽 ${recommended.minLevel}-${recommended.maxLevel} 级`,
      confirmText: "查看球局",
      cancelText: "再看看",
      success: (result) => {
        if (result.confirm) {
          this.navigateToGame(recommended.id);
        }
      },
    });
  },

  openGame(event) {
    this.navigateToGame(event.currentTarget.dataset.id);
  },

  navigateToGame(id) {
    wx.navigateTo({ url: `/pages/game-detail/game-detail?id=${id}` });
  },
});
