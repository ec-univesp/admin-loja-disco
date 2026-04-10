'use client';

import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface CurrencyInputProps
  extends Omit<NumericFormatProps, 'value' | 'onValueChange' | 'onChange'> {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
}

/**
 * Input monetário em pt-BR (R$ 1.234,56).
 * Aceita vírgula como separador decimal e ponto como separador de milhar.
 */
const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  value,
  onChange,
  error,
  className,
  placeholder = 'R$ 0,00',
  ...rest
}) => {
  return (
    <NumericFormat
      id={id}
      value={Number.isFinite(value) ? value : 0}
      onValueChange={(values) => {
        onChange(values.floatValue ?? 0);
      }}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      prefix="R$ "
      placeholder={placeholder}
      className={
        className ??
        `h-11 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors ${
          error
            ? 'border-error-500 bg-error-50 dark:border-error-600 dark:bg-error-900/20'
            : 'border-gray-300 bg-white focus:border-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-brand-600'
        }`
      }
      {...rest}
    />
  );
};

export default CurrencyInput;
