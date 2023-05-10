import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useHasPermissions } from "./useHasPermissions";

export function withPerms(Component) {
  return (props) => {
    const { user } = useAuth0();
    const perms = { user };

    return <Component perms={perms} {...props} />;
  };
}