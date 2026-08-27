const HOUR_MS = 60 * 60 * 1000;
const CONTACT_RETENTION_MS = 24 * HOUR_MS;

const CONTACT_VISIBLE_STATUSES = new Set(["approved", "completed"]);

function toTimestamp(value) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function getRecruitmentSummary(game) {
  const joinedCount = Math.max(0, Number(game.joinedCount) || 0);
  const targetCount = Math.max(0, Number(game.targetCount) || 0);
  const pendingCount = Math.max(0, Number(game.pendingCount) || 0);
  const vacancies = Math.max(0, targetCount - joinedCount);

  return {
    countText: `${joinedCount}/${targetCount}人`,
    pendingText: `${pendingCount}人待审核`,
    vacancies,
    fillTag: vacancies > 0 ? `补位 ${vacancies} 人` : "已满员",
  };
}

function filterGames(games, filters = {}) {
  return games.filter((game) => {
    if (game.status && game.status !== "recruiting") {
      return false;
    }
    if (filters.city && game.city !== filters.city) {
      return false;
    }
    if (
      filters.district &&
      filters.district !== "全部区域" &&
      game.district !== filters.district
    ) {
      return false;
    }
    if (
      filters.type &&
      filters.type !== "全部" &&
      game.type !== filters.type
    ) {
      return false;
    }
    if (
      filters.level !== undefined &&
      filters.level !== null &&
      (Number(filters.level) < Number(game.minLevel) ||
        Number(filters.level) > Number(game.maxLevel))
    ) {
      return false;
    }
    return true;
  });
}

function recommendGame(games, preferences = {}) {
  const candidates = filterGames(games, preferences);
  return (
    candidates
      .slice()
      .sort((left, right) => {
        const leftVacancies = getRecruitmentSummary(left).vacancies;
        const rightVacancies = getRecruitmentSummary(right).vacancies;
        return leftVacancies - rightVacancies;
      })[0] || null
  );
}

function canViewContact({ applicationStatus, endAt, now }) {
  if (!CONTACT_VISIBLE_STATUSES.has(applicationStatus)) {
    return false;
  }

  const endTimestamp = toTimestamp(endAt);
  const nowTimestamp = toTimestamp(now);
  if (endTimestamp === null || nowTimestamp === null) {
    return false;
  }

  return nowTimestamp <= endTimestamp + CONTACT_RETENTION_MS;
}

function getNoShowSummary(records) {
  return {
    historicalNoShowCount: records.filter(
      (record) => record.reviewStatus === "upheld",
    ).length,
  };
}

function resolveGameStatus({ endAt, now, hasDispute = false, status = "active" }) {
  if (hasDispute) {
    return "disputed";
  }
  const endTimestamp = toTimestamp(endAt);
  const nowTimestamp = toTimestamp(now);
  if (
    endTimestamp !== null &&
    nowTimestamp !== null &&
    nowTimestamp > endTimestamp + CONTACT_RETENTION_MS
  ) {
    return "completed";
  }
  return status;
}

module.exports = {
  canViewContact,
  filterGames,
  getNoShowSummary,
  getRecruitmentSummary,
  recommendGame,
  resolveGameStatus,
};
