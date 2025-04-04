<template>
  <div class="header">
    <div class="l-content">
      <img :src="getImageUrl('logo')" class="logo" />
    </div>

    <div class="r-content">
      <el-dropdown @command="handleLogout">
      <span class="el-dropdown-link">
        <img :src="getImageUrl('user')" class="user" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`,import.meta.url).href;
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #fff;
}

.l-content {
  display: flex;
  align-items: center;
  height: 100%;
  width: auto;
  .logo {
    max-height: 70%;
    width: auto;
  }
}

.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

</style>