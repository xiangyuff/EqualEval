import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.userInfo
  },
  actions: {
    setUserInfo(user) {
      this.userInfo = user;
    },
    logout() {
      this.userInfo = null;
      localStorage.removeItem('user_token'); // 清除本地存储（可选）
    }
  }
});