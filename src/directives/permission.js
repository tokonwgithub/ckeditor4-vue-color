import store from "@/store";

function _permission(permissionRoles) {
  const superAdmin = store.getters.admin;
  /* 超级管理员 不校验权限 */
  if (superAdmin) return true;
  const roles = store.getters && store.getters.roles;
  const hasPermission = roles.some((role) => {
    return permissionRoles.includes(role);
  });
  return hasPermission;
}

export default {
  inserted(el, binding) {
    // console.log(el, binding,'090o0')
    const { value: roles } = binding;
    if (roles && roles instanceof Array && roles.length > 0) {
      const hasPermission = _permission(roles);
      if (!hasPermission) el.parentNode && el.parentNode.removeChild(el);
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`);
    }
  },
};

/**
 * @param {Array} value
 * @returns {Boolean}
 */
export const checkPermission = (roles) => {
  if (roles && roles instanceof Array && roles.length > 0) {
    const hasPermission = _permission(roles);
    if (!hasPermission) return false;
    return true;
  } else {
    console.error(`need roles! Like checkPermission="['admin','editor']"`);
    return false;
  }
};
