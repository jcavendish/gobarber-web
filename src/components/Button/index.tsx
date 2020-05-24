import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, isLoading, ...rest }) => {
  if (isLoading) {
    return (
      <Container disabled type="button" {...rest}>
        Carregando...
      </Container>
    );
  }
  return (
    <Container type="button" {...rest}>
      {children}
    </Container>
  );
};

export default Button;
