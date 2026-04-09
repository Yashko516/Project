import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, getDocs, onSnapshot, query, where, collection, orderBy, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserAccount, UserRole, UserPermissions, AuditLogEntry, AuditAction } from '../types/UserType';

// Obter permissões baseadas no role
export function getPermissionsForRole(role: UserRole): UserPermissions {
  const adminPermissions: UserPermissions = {
    canEditTeam: true,
    canDeleteTeam: true,
    canAddPlayers: true,
    canEditPlayers: true,
    canDeletePlayers: true,
    canCreateMatches: true,
    canEditMatches: true,
    canDeleteMatches: true,
    canEditScout: true,
    canGenerateReports: true,
    canCreateTrainings: true,
    canEditTrainings: true,
    canDeleteTrainings: true,
    canInviteUsers: true,
    canRemoveUsers: true,
    canChangeUserRoles: true,
    canViewAuditLog: true,
    canChangeSettings: true,
    canManageCloud: true,
  };

  const editorPermissions: UserPermissions = {
    canEditTeam: true,
    canDeleteTeam: false,
    canAddPlayers: true,
    canEditPlayers: true,
    canDeletePlayers: true,
    canCreateMatches: true,
    canEditMatches: true,
    canDeleteMatches: true,
    canEditScout: true,
    canGenerateReports: true,
    canCreateTrainings: true,
    canEditTrainings: true,
    canDeleteTrainings: true,
    canInviteUsers: false,
    canRemoveUsers: false,
    canChangeUserRoles: false,
    canViewAuditLog: false,
    canChangeSettings: true,
    canManageCloud: true,
  };

  const readonlyPermissions: UserPermissions = {
    canEditTeam: false,
    canDeleteTeam: false,
    canAddPlayers: false,
    canEditPlayers: false,
    canDeletePlayers: false,
    canCreateMatches: false,
    canEditMatches: false,
    canDeleteMatches: false,
    canEditScout: false,
    canGenerateReports: true,
    canCreateTrainings: false,
    canEditTrainings: false,
    canDeleteTrainings: false,
    canInviteUsers: false,
    canRemoveUsers: false,
    canChangeUserRoles: false,
    canViewAuditLog: false,
    canChangeSettings: false,
    canManageCloud: false,
  };

  switch (role) {
    case 'admin':
      return adminPermissions;
    case 'editor':
      return editorPermissions;
    case 'readonly':
      return readonlyPermissions;
    default:
      return readonlyPermissions;
  }
}

// Criar usuário no Firebase Auth e Firestore
export async function createAccount(email: string, password: string, displayName: string, teamId: string, teamName: string, role: UserRole = 'editor'): Promise<UserAccount | null> {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.uid) throw new Error('User ID not found');

    const userAccount: Omit<UserAccount, 'lastActiveAt'> & { lastActiveAt: any } = {
      id: user.uid,
      email: email,
      displayName: displayName,
      role: role,
      teamId: teamId,
      teamName: teamName,
      createdAt: new Date(),
      lastActiveAt: serverTimestamp(),
      isOnline: false,
      permissions: getPermissionsForRole(role),
    };

    await setDoc(doc(db, 'users', user.uid), userAccount);

    return {
      ...userAccount,
      lastActiveAt: new Date(),
    };
  } catch (error: any) {
    console.error('Error creating account:', error);
    throw new Error(error.message || 'Failed to create account');
  }
}

// Login usuário
export async function loginAccount(email: string, password: string): Promise<UserAccount | null> {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) throw new Error('User not found in database');

    const userData = userDoc.data() as any;
    
    // Update last active
    await updateDoc(doc(db, 'users', user.uid), {
      lastActiveAt: serverTimestamp(),
      isOnline: true,
    });

    return {
      ...userData,
      lastActiveAt: userData.lastActiveAt?.toDate() || new Date(),
    } as UserAccount;
  } catch (error: any) {
    console.error('Error logging in:', error);
    throw new Error(error.message || 'Login failed');
  }
}

// Logout usuário
export async function logoutAccount(userId: string): Promise<void> {
  try {
    const auth = getAuth();
    
    // Update online status
    await updateDoc(doc(db, 'users', userId), {
      isOnline: false,
      lastActiveAt: serverTimestamp(),
    });

    await signOut(auth);
  } catch (error: any) {
    console.error('Error logging out:', error);
    throw error;
  }
}

// Obter todos os usuários da equipe
export async function getTeamUsers(teamId: string): Promise<UserAccount[]> {
  try {
    const q = query(
      collection(db, 'users'),
      where('teamId', '==', teamId)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        lastActiveAt: data.lastActiveAt?.toDate() || new Date(),
      } as UserAccount;
    });
  } catch (error: any) {
    console.error('Error getting team users:', error);
    throw error;
  }
}

// Atualizar role de usuário
export async function updateUserRole(userId: string, newRole: UserRole): Promise<void> {
  try {
    const newPermissions = getPermissionsForRole(newRole);
    
    await updateDoc(doc(db, 'users', userId), {
      role: newRole,
      permissions: newPermissions,
    });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Remover usuário da equipe
export async function removeUser(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (error: any) {
    console.error('Error removing user:', error);
    throw error;
  }
}

// Ouvir usuários em tempo real
export function subscribeToTeamUsers(teamId: string, callback: (users: UserAccount[]) => void): () => void {
  const q = query(
    collection(db, 'users'),
    where('teamId', '==', teamId),
    orderBy('createdAt')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        ...data,
        id: doc.id,
        lastActiveAt: data.lastActiveAt?.toDate() || new Date(),
      } as UserAccount;
    });
    callback(users);
  }, (error) => {
    console.error('Error subscribing to team users:', error);
  });

  return unsubscribe;
}

// Verificar permissão específica
export function hasPermission(user: UserAccount | null, permissionKey: keyof UserPermissions): boolean {
  if (!user) return false;
  return user.permissions[permissionKey] || false;
}

// Verificar se user é admin
export function isAdmin(user: UserAccount | null): boolean {
  if (!user) return false;
  return user.role === 'admin';
}