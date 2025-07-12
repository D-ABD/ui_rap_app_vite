// src/pages/users/components/UserTable.tsx
import styled from 'styled-components';
import Button from '../../../components/ui/Button';
import { User } from '../../../types/User';


interface Props {
  users: User[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function UserTable({ users, selectedIds, onToggleSelect, onEdit }: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Statut</th>
          <th>Date d’inscription</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedIds.includes(user.id)}
                onChange={() => onToggleSelect(user.id)}
              />
            </td>
            <td>{user.full_name || `${user.first_name} ${user.last_name}` || user.username}</td>
            <td>{user.email}</td>
            <td>{user.role_display || user.role}</td>
            <td>{user.is_active ? '✅ Actif' : '⛔️ Inactif'}</td>
            <td>{new Date(user.date_joined ?? '').toLocaleDateString()}</td>
            <td>
              <Button $variant="secondary" onClick={() => onEdit(user.id)}>
                ✏️ Modifier
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing.m};

  th, td {
    padding: ${({ theme }) => theme.spacing.s};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    font-weight: bold;
  }

  input[type="checkbox"] {
    transform: scale(1.2);
  }

  button {
    font-size: 0.85rem;
  }
`;
