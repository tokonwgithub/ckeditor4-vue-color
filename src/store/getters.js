const getters = {
   admin: (state) => state.user.admin,
   roles: (state) => state.permission.roles,
   user: (state) => state.user.user,
};
export default getters;
