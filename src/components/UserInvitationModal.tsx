import { useState } from 'react';
import { MailPlus, Shield, UserPlus, X } from 'lucide-react';
import { UserRole, UserAccount } from '../types/UserType';

interface UserInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, displayName: string, role: UserRole) => Promise<void>;
  currentUser: UserAccount | null;
  teamId: string;
  teamName: string;
}

export default function UserInvitationModal({
  isOpen,
  onClose,
  onInvite,
  currentUser,
  teamId,
  teamName,
}: UserInvitationModalProps) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('editor');
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !displayName) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor, insira um email válido');
      return;
    }

    setIsInviting(true);
    try {
      await onInvite(email, displayName, role);
      setEmail('');
      setDisplayName('');
      setRole('editor');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Falha ao convidar usuário');
    } finally {
      setIsInviting(false);
    }
  };

  const canInvite = currentUser?.permissions.canInviteUsers || false;

  if (!canInvite && !currentUser?.permissions.canChangeUserRoles) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-zinc-900/95 border border-red-500/50 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Sem Permissão</h3>
          </div>
          <p className="text-zinc-400 mb-4">
            Você não tem permissão para convidar novos usuários. Entre em contato com o administrador da equipe.
          </p>
          <button onClick={onClose} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors">
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-zinc-900/95 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Convidar Usuário</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Nome do Usuário
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Email
            </label>
            <div className="relative">
              <MailPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: joao@email.com"
                className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Função (Role)
            </label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="admin">Admin - Acesso completo</option>
                <option value="editor">Editor - Pode editar e criar</option>
                <option value="readonly">Read-Only - Apenas visualizar</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-sm text-zinc-500">
              <strong className="text-zinc-400">Admin:</strong> Acesso completo, pode excluir equipe
            </div>
            <div className="text-sm text-zinc-500">
              <strong className="text-zinc-400">Editor:</strong> Pode criar/editar partidas, jogadores, mas não excluir equipe
            </div>
            <div className="text-sm text-zinc-500">
              <strong className="text-zinc-400">Read-Only:</strong> Apenas visualizar e exportar relatórios
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isInviting}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isInviting ? 'Convidando...' : 'Convidar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}