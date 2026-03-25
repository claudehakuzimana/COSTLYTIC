export const ROLE = {
  ADMIN: "admin",
  FINOPS_MANAGER: "finops_manager",
  ENGINEER: "engineer",
  VIEWER: "viewer"
};

export const rolesHierarchy = {
  [ROLE.ADMIN]: 4,
  [ROLE.FINOPS_MANAGER]: 3,
  [ROLE.ENGINEER]: 2,
  [ROLE.VIEWER]: 1
};
