import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  isProtected?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  isProtected = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  const isSignedIn = !!user;

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        if (isPrivate && !isSignedIn) {
          return <Redirect to={{ pathname: '/', state: { from: location } }} />;
        }
        if (isProtected && isSignedIn) {
          return (
            <Redirect
              to={{ pathname: '/dashboard', state: { from: location } }}
            />
          );
        }
        return <Component />;
      }}
    />
  );
};

export default Route;
