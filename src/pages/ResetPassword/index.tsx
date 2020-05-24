import React, { useCallback, useRef } from 'react';

import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Container, Content, AnimatedContainer, Background } from './styles';

import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';
import validateErrors from '../../utils/errorValidator';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import useQuery from '../../hooks/query';

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { addToast } = useToast();
  const query = useQuery();

  const handleSubmit = useCallback(
    async data => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          confirmPassword: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação de senha incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/reset', {
          password: data.password,
          confirmPassword: data.confirmPassword,
          token: query.get('token'),
        });

        addToast({
          title: 'Senha redefinida com sucesso',
          description:
            'Sua senha foi redefinida com sucesso, você já pode fazer login',
          type: 'success',
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(validateErrors(err));
        }
        addToast({
          title: 'Erro na redefinição de senha',
          description: 'Ocorreu um erro na redefinição de sua senha',
          type: 'error',
        });
      }
    },
    [addToast, history, query],
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Redefina sua senha</h1>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Input
              name="confirmPassword"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Redefinir</Button>
          </Form>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
