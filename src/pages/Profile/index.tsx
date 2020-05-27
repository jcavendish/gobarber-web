import React, { useCallback, useRef } from 'react';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import { Container, Content, AnimatedContainer, Avatar } from './styles';
import userImg from '../../assets/user.svg';

import api from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import validateErrors from '../../utils/errorValidator';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome ogrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().max(16, 'Máximo 16 caracteres'),
          confirmPassword: Yup.string().when('password', {
            is: password => password.length > 0,
            then: Yup.string().oneOf(
              [Yup.ref('password'), null],
              'Confirmação de senha incorreta',
            ),
          }),
          oldPassword: Yup.string().when('password', {
            is: password => password.length > 0,
            then: Yup.string()
              .min(4, 'Pelo menos 4 caracteres')
              .max(16, 'Máximo 16 caracteres'),
          }),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, password, confirmPassword, oldPassword } = data;
        const updatedUser = {
          name,
          email,
          ...(password
            ? {
                oldPassword,
                password,
                confirmPassword,
              }
            : {}),
        };

        const response = await api.put('profile', updatedUser);

        updateUser(response.data);

        history.push('/');
        addToast({
          title: 'Usuário atualizado com sucesso!',
          description: 'Seus dados foram atualizados com sucesso',
          type: 'success',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(validateErrors(err));
        }
        addToast({
          title: 'Ocorreu um erro na atualização do usuário',
          type: 'error',
        });
      }
    },
    [addToast, updateUser, history],
  );

  const handleChangeAvatar = useCallback(
    async e => {
      if (e.target.files) {
        try {
          const file = e.target.files[0];
          const formData = new FormData();

          formData.append('avatar', file);

          const response = await api.patch('users/avatar', formData);
          updateUser(response.data);

          addToast({
            title: 'Avatar atualizado com sucesso!',
            type: 'success',
          });
        } catch {
          addToast({
            title: 'Erro ao atualizar seu avatar',
            type: 'error',
          });
        }
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <AnimatedContainer>
          <Avatar>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} />
            ) : (
              <img src={userImg} alt="usuário" />
            )}
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleChangeAvatar} />
            </label>
          </Avatar>
          <Form
            ref={formRef}
            initialData={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={handleSubmit}
          >
            <h1>Meu perfil</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              containerStyles={{ marginTop: 32 }}
              name="oldPassword"
              icon={FiLock}
              type="password"
              placeholder="Senha atual"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="confirmPassword"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />
            <Button type="submit">Confirmar mudanças</Button>
          </Form>
        </AnimatedContainer>
      </Content>
    </Container>
  );
};

export default Profile;
