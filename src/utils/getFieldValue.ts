// utils/getFieldValue.ts
export function getFieldValue(obj: unknown, field: string): string | number | undefined {
  if (typeof obj !== 'object' || obj === null) return undefined;

  const keys = field.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}
