
import { getUserMenuAndPermission } from "@/api/user";
import { AppId,AppIdCustomer } from "config";

export default {
  state: {
    routes: [],
    addRoutes: [],
    routerLoadDone: false,
    roles: [],
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
  },
  actions: {
    reloadRouterLoadDone({ state }) {
      state.routerLoadDone = false;
    },
    async generateRoutes({ commit },data) {
      // console.log(AppIdCustomer,'+AppIdCustomer')
      const { body, status } = await getUserMenuAndPermission({
        appId:data.comeForm ? +AppIdCustomer: +AppId,
      });
      if (status === 200) {
        const { menus, permissions } = body;
        commit("SET_ROLES", permissions);
        // isAdmin
        //   ? matchMenuResource(menus, asyncRoutes)
        //   : LoadMenus(menus, asyncRoutes);
      }
      return [];
    },
  },
};
