function canAccess(resourceLevel, userLevel) {
  return userLevel >= resourceLevel;
}

module.exports = { canAccess };
