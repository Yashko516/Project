import { doc, setDoc, getDocs, query, where, collection, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { AuditLogEntry, AuditAction } from '../types/UserType';

// Criar entrada de audit log
export async function logAction(
  userId: string,
  userEmail: string,
  userName: string,
  action: AuditAction,
  target: string,
  targetType: string,
  details: any
): Promise<void> {
  try {
    const logEntry: Omit<AuditLogEntry, 'id'> & { id: string } = {
      id: `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userEmail,
      userName,
      action,
      target,
      targetType,
      details,
      timestamp: serverTimestamp(),
    };

    await setDoc(doc(db, 'auditLogs', logEntry.id), logEntry);
  } catch (error: any) {
    console.error('Error logging action:', error);
    // Não throw error para não interromper a ação principal
  }
}

// Obter audit logs recentes da equipe
export async function getRecentAuditLogs(teamId: string, limitCount: number = 50): Promise<AuditLogEntry[]> {
  try {
    const q = query(
      collection(db, 'auditLogs'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const logs = querySnapshot.docs
      .map(doc => {
        const data = doc.data() as any;
        return {
          ...data,
          id: doc.id,
        } as AuditLogEntry;
      })
      .filter((log, index, self) => 
        // Filtrar logs duplicados pelo id
        self.findIndex(l => l.id === log.id) === index
      );

    return logs;
  } catch (error: any) {
    console.error('Error getting audit logs:', error);
    throw error;
  }
}

// Obter logs de um usuário específico
export async function getUserAuditLogs(userId: string): Promise<AuditLogEntry[]> {
  try {
    const q = query(
      collection(db, 'auditLogs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        timestamp: data.timestamp?.toDate() || new Date(),
      } as AuditLogEntry;
    });
  } catch (error: any) {
    console.error('Error getting user audit logs:', error);
    throw error;
  }
}

// Formatar action para exibição
export function formatAction(action: AuditAction): string {
  const actionLabels: Record<AuditAction, string> = {
    create: 'Criou',
    update: 'Atualizou',
    delete: 'Excluiu',
    login: 'Entrou',
    logout: 'Saiu',
    invite_user: 'Convidou usuário',
    remove_user: 'Removeu usuário',
    change_role: 'Mudou role',
    export_report: 'Exportou relatório',
    backup_cloud: 'Backup na nuvem',
    restore_cloud: 'Restore da nuvem',
    scout_action: 'Registro de scout',
    edit_team: 'Editou equipe',
    delete_team: 'Excluiu equipe',
  };

  return actionLabels[action] || action;
}

// Formatar tipo de target
export function formatTargetType(targetType: string): string {
  const typeLabels: Record<string, string> = {
    team: 'Equipe',
    player: 'Jogador',
    match: 'Partida',
    training: 'Treino',
    user: 'Usuário',
    goal: 'Objetivo',
    achievement: 'Conquista',
    note: 'Nota',
    report: 'Relatório',
    backup: 'Backup',
  };

  return typeLabels[targetType] || targetType;
}