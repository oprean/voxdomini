import { useAuth0 } from "@auth0/auth0-react";

export const useHasPermissions = (permissionNames, obj=null) => {
  const {user} = useAuth0(); let objType = undefined;
  if (user === undefined) return false;
  
  if (obj !== null) {
    objType = Object.keys(obj)[0];
    obj = obj[objType];
  }

  const permissions = user['https://auth0.api.users.bitalb.ro/permissions'];
  const roles = user['https://auth0.api.users.bitalb.ro/roles']
  if (!permissions || !roles) {
    return false;
  }

  if (roles.includes('admin')) return true;

  if (typeof permissionNames === "string") {
    if (permissions.includes?.(permissionNames)) {
      switch (objType) {
        case 'event':
          return user.profile.id == obj.createdbyId || user.profile.id == obj.assistantId || user.profile.id == obj.responsibleId      
        default:
          return true;
      }
    } else return false
  } else if (Array.isArray(permissionNames)) {
    // TODO duplicate the logic from 'string' here!
    return permissions.some((permissionName) =>
      Boolean(permissionNames.includes?.(permissionName))
    );
  } else {
    return false;
  }
};
