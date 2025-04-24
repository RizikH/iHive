const supabase = require("../config/db");

const permissionMap = {
  public: 0,
  protected: 1,
  private: 2
};

const getLevel = async (userId, ideaId) => {
  const { data, error } = await supabase
    .from("collaborations")
    .select("permissions")
    .eq("user_id", userId)
    .eq("idea_id", ideaId)
    .single();

  if (error) {
    console.error("Error fetching collaboration data:", error.message);
    throw new Error("Failed to fetch collaboration data");
  }

  if (!data || !data.permissions || !(data.permissions in permissionMap)) {
    throw new Error("User does not have valid permission for this idea.");
  }

  return permissionMap[data.permissions]; // e.g. "protected" → 1
};

module.exports = { getLevel };
