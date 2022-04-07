import { getToken, setToken } from "@/utils/Auth";
import {getUserDetailsInfo} from "@/api/user";
import { Role } from "@/utils/Enum/User";
import i18n from "@/lang";

export default {
  state: {
    token: getToken(),
    user: {},
    name: null,
    avatar: null,
    admin: null,
    depts:[]
  },
  mutations: {
    SET_TOKEN: (_, token) => {
      setToken(token);
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_WS: (state, ws) => {
      state.ws = ws;
    },
    SET_ADMIN: (state, bool) => {
      state.admin = bool;
    },
  },
  actions: {
    /* 获取用户详情 */
    async getUserInfo({ commit,state }) {
      const { body, status } = await getUserDetailsInfo();
      if (status === 200) {
        const { user, account, depts, companyName } = body;
        const { ynAdmin } = account;
        const superAdmin = ynAdmin === Role.ADMIN;
        state.depts = depts;
        state.companyName = companyName;
        commit("SET_ADMIN", superAdmin);
        commit("SET_NAME", user.userName);
        commit("SET_USER", { avatar: null, ...user });
        commit("SET_AVATAR", null);
        return { isAdmin: superAdmin };
      }
      return { isAdmin: false };
    },

  },
};
