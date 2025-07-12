import { useState } from 'react';
import type { FormationFormData, FormationFormErrors } from '../types/formation';

export function useFormationForm(initialValues: FormationFormData) {
  const [values, setValues] = useState<FormationFormData>(initialValues);
  const [errors, setErrors] = useState<FormationFormErrors>({});

  const handleChange = <K extends keyof FormationFormData>(field: K, value: FormationFormData[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, setValues, errors, setErrors, handleChange, reset };
}
