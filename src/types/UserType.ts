// Tipos para sistema de multi-usuários e permissões

export type UserRole = 'admin' | 'editor' | 'readonly';

export interface UserAccount {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  teamId: string;
  teamName: string;
  createdAt: Date;
  lastActiveAt: Date;
  isOnline: boolean;
  permissions: UserPermissions;
}

export interface UserPermissions {
  // Gestão de equipe
  canEditTeam: boolean;
  canDeleteTeam: boolean;
  canAddPlayers: boolean;
  canEditPlayers: boolean;
  canDeletePlayers: boolean;
  
  // Gestão de partidas
  canCreateMatches: boolean;
  canEditMatches: boolean;
  canDeleteMatches: boolean;
  canEditScout: boolean;
  canGenerateReports: boolean;
  
  // Gestão de treinos
  canCreateTrainings: boolean;
  canEditTrainings: boolean;
  canDeleteTrainings: boolean;
  
  // Gestão de usuários (apenas admin)
  canInviteUsers: boolean;
  canRemoveUsers: boolean;
  canChangeUserRoles: boolean;
  canViewAuditLog: boolean;
  
  // Configurações
  canChangeSettings: boolean;
  canManageCloud: boolean;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  action: AuditAction;
  target: string;
  targetType: string;
  details: any;
  timestamp: Date;
  ipAddress?: string;
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  INVITE_USER = 'invite_user',
  REMOVE_USER = 'remove_user',
  CHANGE_ROLE = 'change_role',
  EXPORT_REPORT = 'export_report',
  BACKUP_CLOUD = 'backup_cloud',
  RESTORE_CLOUD = 'restore_cloud',
  SCOUT_ACTION = 'scout_action',
  EDIT_TEAM = 'edit_team',
  DELETE_TEAM = 'delete_team',
}