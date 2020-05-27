import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  header {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #28262e;
    height: 144px;

    div {
      width: 100%;
      max-width: 1120px;

      svg {
        width: 24px;
        height: 24px;
        color: #999591;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const appearFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -93px;

  animation: ${appearFromRight} 1s;

  form {
    margin: 60px auto;
    width: 340px;

    h1 {
      margin-bottom: 24px;
      font-size: 24px;
      text-align: left;
    }
  }

  > a {
    color: #f4ede8;
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#ff9000')};
    }

    svg {
      margin-right: 16px;
    }
  }
`;

export const Avatar = styled.div`
  width: 186px;
  height: 186px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    color: #f4ede8;
  }

  label {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    border: 0;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }

    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }

    input {
      display: none;
    }
  }
`;
