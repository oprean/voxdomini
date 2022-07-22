import { useAuth0 } from "@auth0/auth0-react";

export const useHasPermissions = (permissionNames) => {
  const {user} = useAuth0();
  const permissions = user['https://auth0.api.users.bitalb.ro/permissions'];
  
  if (!permissions) {
    return false;
  }
  if (typeof permissionNames === "string") {
    return permissions.includes?.(permissionNames);
  } else if (Array.isArray(permissionNames)) {
    return permissions.some((permissionName) =>
      Boolean(permissionNames.includes?.(permissionName))
    );
  } else {
    return false;
  }
};
