import { setStorage, rmJsonStorage, getStorage } from "./index";
import { Storage } from "@/utils/Enum/index";

export function getToken() {
  return getStorage(Storage.TOKEN);
}

export function setToken(token) {
  return setStorage(Storage.TOKEN, token);
}

export function removeToken() {
  return rmJsonStorage(Storage.TOKEN);
}