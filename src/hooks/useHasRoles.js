import useCurrentUser from "./useCurrentUser";
export const useHasRole = (roleNames) => {
  const { currentUser } = useCurrentUser();

  const { userTypeId } = currentUser || { userTypeId: null };

  if (!userTypeId) {
    return false;
  }
  if (typeof roleNames === "number") {
    return userTypeId === roleNames;
  } else if (Array.isArray(roleNames)) {
    return roleNames.some((role) => role === userTypeId);
  } else {
    return false;
  }
};
