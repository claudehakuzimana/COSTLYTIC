export const roles = {
  ADMIN: 'admin',
  FINOPS_MANAGER: 'finops_manager',
  ENGINEER: 'engineer',
  VIEWER: 'viewer'
};

export const roleHierarchy = {
  admin: ['finops_manager', 'engineer', 'viewer'],
  finops_manager: ['engineer', 'viewer'],
  engineer: ['viewer'],
  viewer: []
};

export const permissions = {
  admin: ['*'],
  finops_manager: [
    'view:analytics',
    'manage:alerts',
    'view:usage',
    'manage:budget'
  ],
  engineer: [
    'ingest:usage',
    'view:usage',
    'view:costs'
  ],
  viewer: [
    'view:analytics',
    'view:usage',
    'view:costs'
  ]
};

export const hasPermission = (userRole, permission) => {
  if (permissions[userRole].includes('*')) {
    return true;
  }
  return permissions[userRole].includes(permission);
};

export const canAccessRole = (userRole, targetRole) => {
  return roleHierarchy[userRole]?.includes(targetRole) || userRole === targetRole;
};

export default {
  roles,
  roleHierarchy,
  permissions,
  hasPermission,
  canAccessRole
};
