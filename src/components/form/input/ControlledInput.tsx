import React, { FC } from 'react';
import Input from './InputField';

interface ControlledInputProps {
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | string;
  id?: string;
  placeholder?: string;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  name?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const ControlledInput: FC<ControlledInputProps> = React.forwardRef(
  (props, ref) => {
    const { ...rest } = props;

    return <Input {...rest} />;
  }
);

ControlledInput.displayName = 'ControlledInput';

export default ControlledInput;
