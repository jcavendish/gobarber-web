import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { FiMail } from 'react-icons/fi';
import Input from '../../components/Input';

const mockedUseField = jest.fn(() => {
  return {
    fieldName: 'email',
    defaultValue: '',
    error: '',
    registerField: jest.fn(),
  };
});

jest.mock('@unform/core', () => {
  return {
    useField: () => mockedUseField(),
  };
});

describe('Input Component', () => {
  it('should be able to render input component', () => {
    const { findByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = findByPlaceholderText('E-mail');

    expect(inputElement).toBeTruthy();
  });

  it('should change border and text colors when receive focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await wait(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #ff9000');
      expect(inputContainerElement).toHaveStyle('color: #ff9000');
    });
  });

  it('should not change border and text colors when lose focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainerElement).not.toHaveStyle('border-color: #ff9000');
      expect(inputContainerElement).not.toHaveStyle('color: #ff9000');
    });
  });

  it('should keep text color when input is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.change(inputElement, { target: { value: 'johndoe@email.dev' } });
    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #232129');
      expect(inputContainerElement).toHaveStyle('color: #ff9000');
    });
  });

  it('should render tooltip when input has errors', async () => {
    mockedUseField.mockImplementation(() => {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: 'test-error',
        registerField: jest.fn(),
      };
    });

    const { getByTestId } = render(<Input name="email" placeholder="E-mail" />);

    const inputErrorElement = getByTestId('input-error');

    await wait(() => {
      expect(inputErrorElement).toBeTruthy();
    });
  });

  it('should render icon when icon is passed', async () => {
    const { getByTestId } = render(
      <Input name="email" placeholder="E-mail" icon={FiMail} />,
    );

    const inputIconElement = getByTestId('input-icon');

    await wait(() => {
      expect(inputIconElement).toBeTruthy();
    });
  });
});
