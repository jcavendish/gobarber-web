import React, { useCallback, useRef, useState } from 'react';

import { FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Container, Content, AnimatedContainer, Background } from './styles';

import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import validateErrors from '../../utils/errorValidator';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async data => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('password/forgot', { email: data.email });

        addToast({
          title: 'Pedido de recuperação de senha feito com sucesso',
          description:
            'Um e-mail contendo os passos para a recupeção da sua senha foi enviado. Verifique seu e-mail',
          type: 'success',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(validateErrors(err));
        }
        addToast({
          title: 'Erro na recuperção de senha',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperação de senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button type="submit" isLoading={loading}>
              Recuperar
            </Button>

            <Link to="/">Voltar para logon</Link>
          </Form>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
