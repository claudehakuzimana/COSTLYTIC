export default {
  roles: {
    admin: 'Administrator',
    finops_manager: 'FinOps Manager',
    engineer: 'Engineer',
    viewer: 'Viewer'
  },
  permissions: {
    admin: ['read', 'write', 'delete', 'manage_users'],
    finops_manager: ['read', 'write', 'view_analytics'],
    engineer: ['read', 'write'],
    viewer: ['read']
  },
  costs: {
    high: 1000,
    medium: 500,
    low: 100
  }
};
