import { useState, useEffect } from 'react';
import { User, CareForm } from './index'; // '../types' ki jagah './index' kar diya
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        const enhancedData = data.map((u: any) => ({ ...u, submittedForms: [] }));
        setUsers(enhancedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addUser = (user: Omit<User, 'id' | 'submittedForms'>) => {
    const newUser = { ...user, id: Date.now(), submittedForms: [] };
    setUsers([newUser, ...users]);
  };

  const editUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const addFormToUser = (userId: number, form: CareForm) => {
    setUsers(users.map(u => 
      u.id === userId 
      ? { ...u, submittedForms: [...u.submittedForms, form] } 
      : u
    ));
  };

  return { users, loading, error, addUser, editUser, deleteUser, addFormToUser };
};
