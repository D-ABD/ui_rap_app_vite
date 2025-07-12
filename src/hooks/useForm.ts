import { useState, type ChangeEvent } from 'react';

export default function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // Gère les champs texte, select, textarea, checkbox
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const newValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setValues((prev) => ({ ...prev, [id]: newValue }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  // Alias dédié pour les checkboxes (optionnel mais utile)
const handleCheckbox = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { id } = e.target;
  const checked = 'checked' in e.target ? (e.target as HTMLInputElement).checked : false;

  setValues((prev) => ({ ...prev, [id]: checked }));
  setErrors((prev) => ({ ...prev, [id]: '' }));
};


  // Modifie une seule valeur proprement
  const setFieldValue = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // Réinitialise le formulaire
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleCheckbox,
    setFieldValue,
    setErrors,
    setValues,
    resetForm,
  };
}
