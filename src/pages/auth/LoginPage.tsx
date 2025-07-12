// src/pages/LoginPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import {
  Wrapper,
  Card,
  Title,
  Label,
  Input,
  Button,
  ErrorMessage,
  StyledLink,
} from '../../components/LoginFormElements';

/**
 * 🔐 LoginPage
 *
 * Page de connexion utilisateur.
 * Affiche un formulaire avec email et mot de passe.
 * Gère les erreurs de manière conviviale et redirige en cas de succès.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Soumission du formulaire de connexion.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.detail || 'Identifiants incorrects.';
        setError(msg);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>Se connecter</Title>

        <form onSubmit={handleSubmit}>
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            autoFocus
            required
          />

          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <ErrorMessage role="alert" aria-live="assertive">
              {error}
            </ErrorMessage>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <StyledLink to="/register">
          Pas encore de compte ? Créer un compte
        </StyledLink>
      </Card>
    </Wrapper>
  );
}
