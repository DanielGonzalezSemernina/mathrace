import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    loginInfo: {
      loggedIn: false,
      username: '',
    },
  }),
  actions: {
    setLoginInfo({ loggedIn, username, image }) {
      this.loginInfo.loggedIn = loggedIn;
      this.loginInfo.username = username;
      localStorage.setItem('authInfo', JSON.stringify(this.loginInfo));
    },
    logout() {
      this.loginInfo = { loggedIn: false, username: '', image: '' };
      localStorage.removeItem('authInfo');
    },
    checkAuthentication() {
      const storedAuthInfo = localStorage.getItem('authInfo');

      if (storedAuthInfo) {
        const authInfo = JSON.parse(storedAuthInfo);
        this.setLoginInfo(authInfo);
      }
    },
  },
});
