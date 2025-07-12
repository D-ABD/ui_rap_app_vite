// src/pages/users/UsersCreatePage.tsx
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import PageLayout from '../../components/PageLayout';
import FormCard from '../../components/ui/FormCard';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import Button from '../../components/ui/Button';
import useForm from '../../hooks/useForm';

import { useUserRoles } from '../../hooks/useUsers';

import api from '../../api/axios';
import { UserCreatePayload } from '../../types/User';
import { AxiosError } from 'axios';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export default function UsersCreatePage() {
  const navigate = useNavigate();
  const { roles, loading: loadingRoles } = useUserRoles();

  const {
    values, errors, handleChange, setErrors, resetForm
  } = useForm<UserCreatePayload>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    phone: '',
    bio: '',
    avatar: null,
    role: 'stagiaire',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
        for (const [key, value] of Object.entries(values)) {
        if (value !== null && value !== undefined) {
            if (value instanceof File || typeof value === 'string') {
            formData.append(key, value);
            } else {
            formData.append(key, String(value));
            }
        }
        }


      await api.post('/users/', formData);
      toast.success('✅ Utilisateur créé');
      navigate('/users');
    } catch (err) {
  const error = err as AxiosError<{ errors?: Record<string, string> }>;
  const errors = error.response?.data?.errors;
  if (errors) {
    setErrors(errors);
  }
  toast.error("Erreur lors de la création");
}

  };

  return (
    <PageLayout
      title="Créer un utilisateur"
      showBack
      showRefresh
      onRefresh={() => {
        resetForm();
        toast.info('Formulaire réinitialisé');
      }}
    >
      <FormCard>
        <Form onSubmit={handleSubmit}>
          <FormInput id="email" name="email" label="Email" value={values.email} onChange={handleChange} error={errors.email} required />
          <FormInput id="username" name="username" label="Nom d’utilisateur" value={values.username} onChange={handleChange} error={errors.username} required />
          <FormInput id="first_name" name="first_name" label="Prénom" value={values.first_name} onChange={handleChange} error={errors.first_name} />
          <FormInput id="last_name" name="last_name" label="Nom" value={values.last_name} onChange={handleChange} error={errors.last_name} />
          <FormInput id="password" name="password" label="Mot de passe" type="password" value={values.password} onChange={handleChange} error={errors.password} required />
          <FormSelect id="role" name="role" label="Rôle" value={values.role} onChange={handleChange} options={roles.map(r => ({ value: r.value, label: r.label }))} error={errors.role} />
          <FormInput id="phone" name="phone" label="Téléphone" value={values.phone || ''} onChange={handleChange} error={errors.phone} />
          <FormInput id="bio" name="bio" label="Bio" value={values.bio || ''} onChange={handleChange} error={errors.bio} />
          <FormInput id="avatar" name="avatar" label="Avatar" type="file" onChange={handleChange} />

          <ButtonRow>
            <Button type="submit" $variant="success" disabled={loadingRoles}>💾 Créer</Button>
            <Button type="button" $variant="secondary" onClick={() => navigate('/users')}>Annuler</Button>
          </ButtonRow>
        </Form>
      </FormCard>
    </PageLayout>
  );
}
