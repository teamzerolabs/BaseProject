export enum UserRoleEnum {
  None = 'None', // Not yet registered
  Admin = 'Admin', // Admin can modify other users (name/email/password/roles)
  Viewer = 'Viewer', // Default user status after registration
}
