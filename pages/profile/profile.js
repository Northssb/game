const { profile } = require("../../data/mock-data");

Page({
  data: {
    profile,
  },

  onShow() {
    const ratingResult = wx.getStorageSync("ratingResult");
    this.setData({
      profile: ratingResult
        ? {
            ...profile,
            selfLevel: ratingResult.selfLevel,
            assessmentLevel: ratingResult.assessmentLevel,
          }
        : profile,
    });
  },

  openRating() {
    wx.navigateTo({ url: "/pages/rating/rating" });
  },

  showPrototypeNotice(event) {
    wx.showToast({
      title: `${event.currentTarget.dataset.name}将在接入后台后开放`,
      icon: "none",
    });
  },
});
