import styled from 'styled-components';
import type { ChangeEvent, ReactNode, ElementType } from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Label = styled.label`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.s};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 2px
      ${({ theme, $hasError }) =>
        $hasError ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
  }
`;

const Textarea = styled.textarea<{ $hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.s};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-size: ${({ theme }) => theme.fontSizes.body};
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 2px
      ${({ theme, $hasError }) =>
        $hasError ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

interface Props {
  id: string;
  name?: string;
  label: ReactNode;
  value?: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  as?: 'input' | 'textarea';
  min?: number;
  max?: number;
  step?: number;
  checked?: boolean;
}

export default function FormInput({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  error,
  as = 'input',
  min,
  max,
  step,
  checked,
}: Props) {
  const InputComponent: ElementType = as === 'textarea' ? Textarea : Input;
  const isCheckbox = type === 'checkbox';

  const commonProps = {
    id,
    name: name ?? id,
    ...(isCheckbox ? { checked } : { value: value !== undefined ? String(value) : '' }),
    onChange,
    required,
    placeholder,
    $hasError: !!error,
  };

  const inputSpecificProps =
    as === 'input'
      ? {
          type,
          ...(min !== undefined ? { min } : {}),
          ...(max !== undefined ? { max } : {}),
          ...(step !== undefined ? { step } : {}),
        }
      : {};

  return (
    <Wrapper>
      <Label htmlFor={id}>
        {label} {required && '*'}
      </Label>
      <InputComponent {...commonProps} {...inputSpecificProps} />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}
