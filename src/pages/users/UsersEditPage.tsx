import { useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { AxiosError } from 'axios';

import PageLayout from '../../components/PageLayout';
import FormCard from '../../components/ui/FormCard';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';

import useForm from '../../hooks/useForm';
import { useUserRoles } from '../../hooks/useUsers';
import api from '../../api/axios';
import { UserUpdatePayload } from '../../types/User';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export default function UsersEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roles, loading: loadingRoles } = useUserRoles();

  const {
    values, errors, setValues, setErrors, handleChange,
  } = useForm<UserUpdatePayload>({
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    role: 'stagiaire',
  });

  useEffect(() => {
    if (!id) return;
    api.get(`/users/${id}/`)
      .then(res => setValues(res.data.data))
      .catch(() => toast.error("Erreur lors du chargement"));
  }, [id, setValues]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) {
      toast.error("ID utilisateur invalide.");
      return;
    }

    try {
      await api.patch(`/users/${id}/`, values);
      toast.success("✅ Utilisateur mis à jour");
      navigate('/users');
    } catch (err) {
      const error = err as AxiosError<{ errors?: Record<string, string[]> }>;
      const rawErrors = error?.response?.data?.errors;

      if (rawErrors) {
        const parsedErrors: Partial<Record<keyof UserUpdatePayload, string>> = {};
        for (const key in rawErrors) {
          const messages = rawErrors[key];
          if (Array.isArray(messages) && typeof messages[0] === 'string') {
            parsedErrors[key as keyof UserUpdatePayload] = messages[0];
          }
        }
        setErrors(parsedErrors);
      }

      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (!values.username) return <Loader />;

  return (
    <PageLayout title={`Modifier ${values.username}`} showBack>
      <FormCard>
        <Form onSubmit={handleSubmit}>
          <FormInput id="username" name="username" label="Nom d’utilisateur" value={values.username} onChange={handleChange} error={errors.username} />
          <FormInput id="first_name" name="first_name" label="Prénom" value={values.first_name || ''} onChange={handleChange} error={errors.first_name} />
          <FormInput id="last_name" name="last_name" label="Nom" value={values.last_name || ''} onChange={handleChange} error={errors.last_name} />
          <FormSelect id="role" name="role" label="Rôle" value={values.role || ''} onChange={handleChange} options={roles.map(r => ({ value: r.value, label: r.label }))} error={errors.role} />
          <FormInput id="phone" name="phone" label="Téléphone" value={values.phone || ''} onChange={handleChange} error={errors.phone} />
          <FormInput id="bio" name="bio" label="Bio" value={values.bio || ''} onChange={handleChange} error={errors.bio} />

          <ButtonRow>
            <Button type="submit" $variant="success" disabled={loadingRoles}>💾 Enregistrer</Button>
            <Button type="button" $variant="secondary" onClick={() => navigate('/users')}>Annuler</Button>
          </ButtonRow>
        </Form>
      </FormCard>
    </PageLayout>
  );
}
