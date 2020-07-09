import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedAddToast = jest.fn();
const mockedSignIn = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn page', () => {
  beforeEach(() => {
    mockedAddToast.mockClear();
    mockedSignIn.mockClear();
  });

  it('should be able to sign in', async () => {
    const { findByPlaceholderText, findByText } = render(<SignIn />);

    const emailInput = await findByPlaceholderText('E-mail');
    const passwordInput = await findByPlaceholderText('Senha');
    const submitButton = await findByText('Entrar');

    fireEvent.change(emailInput, {
      target: {
        value: 'johndoe@gobarber.dev',
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        value: 'mypassword',
      },
    });

    fireEvent.click(submitButton);

    await wait(() =>
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      ),
    );
  });

  it('should not be able to sign in with wrong credentials', async () => {
    const { findByPlaceholderText, findByText } = render(<SignIn />);

    const emailInput = await findByPlaceholderText('E-mail');
    const passwordInput = await findByPlaceholderText('Senha');
    const submitButton = await findByText('Entrar');

    fireEvent.change(emailInput, {
      target: {
        value: 'invalid_email',
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        value: 'mypassword',
      },
    });

    fireEvent.click(submitButton);

    await wait(() =>
      expect(mockedAddToast).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      ),
    );
  });
});

it('should display a toast when error in sign in', async () => {
  mockedSignIn.mockImplementation(() => {
    throw new Error();
  });

  const { findByPlaceholderText, findByText } = render(<SignIn />);

  const emailInput = await findByPlaceholderText('E-mail');
  const passwordInput = await findByPlaceholderText('Senha');
  const submitButton = await findByText('Entrar');

  fireEvent.change(emailInput, {
    target: {
      value: 'johndoe@gobarber.dev',
    },
  });

  fireEvent.change(passwordInput, {
    target: {
      value: 'mypassword',
    },
  });

  fireEvent.click(submitButton);

  await wait(() =>
    expect(mockedAddToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
      }),
    ),
  );
});
