function pad(value) {
  return String(value).padStart(2, "0");
}

function createTime(dayOffset, startHour, duration = 2) {
  const start = new Date();
  start.setDate(start.getDate() + dayOffset);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  return {
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    dateLabel: `${start.getMonth() + 1}月${start.getDate()}日`,
    weekdayLabel: weekdays[start.getDay()],
    timeLabel: `${pad(start.getHours())}:00-${pad(end.getHours())}:00`,
    dayCategory: dayOffset === 0 ? "今天" : dayOffset === 1 ? "明天" : "本周",
  };
}

function createGame(game, timing) {
  return {
    city: "深圳市",
    status: "recruiting",
    ...timing,
    ...game,
  };
}

const games = [
  createGame(
    {
      id: "mixed-nanshan-01",
      title: "下班轻松混双",
      type: "混双",
      district: "南山区",
      areaHint: "科技园片区",
      joinedCount: 3,
      targetCount: 4,
      pendingCount: 1,
      minLevel: 3,
      maxLevel: 5,
      intensity: "轻松交流",
      note: "希望水平接近，审核通过后联系，场地和费用大家线下商量。",
      organizer: {
        name: "林屿",
        initial: "林",
        level: 4,
        completedCount: 46,
        attendanceRate: 98,
        historicalNoShows: 0,
        contact: "微信：linyu_badminton",
      },
      members: ["林", "陈", "乔"],
    },
    createTime(1, 19),
  ),
  createGame(
    {
      id: "mens-single-futian-01",
      title: "周末男单对练",
      type: "男单",
      district: "福田区",
      areaHint: "车公庙片区",
      joinedCount: 1,
      targetCount: 2,
      pendingCount: 0,
      minLevel: 4,
      maxLevel: 6,
      intensity: "正常强度",
      note: "以练球为主，不记录比分，场馆通过后再联系确定。",
      organizer: {
        name: "阿远",
        initial: "远",
        level: 5,
        completedCount: 31,
        attendanceRate: 100,
        historicalNoShows: 0,
        contact: "手机：138 0000 2418",
      },
      members: ["远"],
    },
    createTime(2, 10),
  ),
  createGame(
    {
      id: "womens-double-baoan-01",
      title: "女生双打欢乐局",
      type: "女双",
      district: "宝安区",
      areaHint: "新安片区",
      joinedCount: 5,
      targetCount: 8,
      pendingCount: 2,
      minLevel: 2,
      maxLevel: 4,
      intensity: "欢乐轮换",
      note: "新手友好，计划多人轮换，审核后再一起定球馆。",
      organizer: {
        name: "小鹿",
        initial: "鹿",
        level: 3,
        completedCount: 64,
        attendanceRate: 97,
        historicalNoShows: 1,
        contact: "微信：deer_shuttle",
      },
      members: ["鹿", "周", "晴", "吴", "孟"],
    },
    createTime(3, 15),
  ),
  createGame(
    {
      id: "mens-double-longgang-01",
      title: "男双高强度轮换",
      type: "男双",
      district: "龙岗区",
      areaHint: "坂田片区",
      joinedCount: 4,
      targetCount: 6,
      pendingCount: 0,
      minLevel: 5,
      maxLevel: 7,
      intensity: "较高强度",
      note: "希望有稳定后场能力，球和场地费用线下均摊。",
      organizer: {
        name: "大川",
        initial: "川",
        level: 6,
        completedCount: 83,
        attendanceRate: 99,
        historicalNoShows: 0,
        contact: "手机：136 0000 9527",
      },
      members: ["川", "许", "唐", "杨"],
    },
    createTime(4, 20),
  ),
];

const profile = {
  name: "周末扣杀",
  initial: "周",
  city: "深圳市",
  district: "南山区",
  selfLevel: 4,
  assessmentLevel: 3.5,
  assessmentLabel: "水平基本相符",
  completedCount: 28,
  historicalNoShows: 1,
  attendanceRate: 97,
  wechat: "weekend_smash",
  phoneMasked: "138****2418",
  tags: ["守时", "友好", "沟通顺畅"],
};

module.exports = {
  games,
  profile,
};
