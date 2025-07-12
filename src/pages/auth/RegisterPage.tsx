import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import {
  Wrapper,
  Card,
  Title,
  Label,
  Input,
  Button,
  ErrorMessage,
} from '../../components/LoginFormElements';

/**
 * 📝 RegisterPage
 *
 * Page d'inscription utilisateur.
 * Envoie les champs requis par `RegistrationSerializer`.
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password1 !== form.password2) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await api.post('/register/', {
        email: form.email,
        password: form.password1,
        first_name: form.first_name,
        last_name: form.last_name,
      });

      toast.success('✅ Compte créé avec succès. En attente de validation par un administrateur.');
      navigate('/login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as Record<string, string[]>;
        const msg =
          data?.email?.[0] ||
          data?.password?.[0] ||
          data?.first_name?.[0] ||
          data?.last_name?.[0] ||
          data?.non_field_errors?.[0] ||
          'Erreur lors de la création du compte.';
        setError(msg);
      } else {
        setError('Une erreur inconnue est survenue.');
      }
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Créer un compte</Title>

        <form onSubmit={handleSubmit}>
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            required
          />

          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            required
          />

          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Label htmlFor="password1">Mot de passe</Label>
          <Input
            id="password1"
            name="password1"
            type="password"
            value={form.password1}
            onChange={handleChange}
            required
          />

          <Label htmlFor="password2">Confirmer le mot de passe</Label>
          <Input
            id="password2"
            name="password2"
            type="password"
            value={form.password2}
            onChange={handleChange}
            required
          />

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

          <Button type="submit">Créer un compte</Button>
        </form>
      </Card>
    </Wrapper>
  );
};

export default RegisterPage;
