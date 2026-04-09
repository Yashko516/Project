import { useState } from 'react';
import { Shield, UserPlus, MoreVertical, Trash2, Activity } from 'lucide-react';
import { UserRole, UserAccount } from '../types/UserType';

interface UserListProps {
  users: UserAccount[];
  currentUser: UserAccount | null;
  onInviteClick: () => void;
  onChangeRole: (userId: string, newRole: UserRole) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
  onViewAuditLog?: (userId: string) => void;
}

export default function UserList({
  users,
  currentUser,
  onInviteClick,
  onChangeRole,
  onRemoveUser,
  onViewAuditLog,
}: UserListProps) {
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'editor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'readonly':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      case 'readonly':
        return 'Read-Only';
    }
  };

  const isCurrentUser = (user: UserAccount) => {
    return user.id === currentUser?.id;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Usuários da Equipe
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {users.length} {users.length === 1 ? 'usuário' : 'usuários'}
          </p>
        </div>
        {currentUser?.permissions.canInviteUsers && (
          <button
            onClick={onInviteClick}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Convidar
          </button>
        )}
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-4 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl hover:bg-zinc-800 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.displayName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate">{user.displayName}</h3>
                {isCurrentUser(user) && (
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Você</span>
                )}
              </div>
              <p className="text-sm text-zinc-400 truncate">{user.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {user.isOnline && (
                <div className="flex items-center gap-1.5 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online
                </div>
              )}

              {(currentUser?.permissions.canChangeUserRoles || currentUser?.permissions.canRemoveUsers) && !isCurrentUser(user) && (
                <div className="relative">
                  <button onClick={() => setShowMenu(showMenu === user.id ? null : user.id)} className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-zinc-400" />
                  </button>

                  {showMenu === user.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-10">
                      {currentUser?.permissions.canChangeUserRoles && (
                        <button onClick={() => {
                          const newRole = user.role === 'admin' ? 'readonly' : 'editor';
                          if (newRole !== user.role) {
                            setShowMenu(null);
                            onChangeRole(user.id, newRole);
                          }
                        }} className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Mudar Role
                        </button>
                      )}

                      {currentUser?.permissions.canRemoveUsers && (
                        <button onClick={() => {
                          setShowMenu(null);
                          if (confirm(`Tem certeza que deseja remover ${user.displayName}?`)) {
                            onRemoveUser(user.id);
                          }
                        }} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-700 flex items-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Remover
                        </button>
                      )}

                      {onViewAuditLog && currentUser?.permissions.canViewAuditLog && (
                        <button onClick={() => {
                          setShowMenu(null);
                          onViewAuditLog(user.id);
                        }} className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Ver Audit Log
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Permissões por Role
        </h3>
        <div className="space-y-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${getRoleBadgeColor('admin').split(' ')[0]}`}></span>
            <strong className="text-zinc-300">Admin:</strong> Acesso completo
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${getRoleBadgeColor('editor').split(' ')[0]}`}></span>
            <strong className="text-zinc-300">Editor:</strong> Pode criar/editar
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${getRoleBadgeColor('readonly').split(' ')[0]}`}></span>
            <strong className="text-zinc-300">Read-Only:</strong> Apenas visualizar
          </div>
        </div>
      </div>
    </div>
  );
}