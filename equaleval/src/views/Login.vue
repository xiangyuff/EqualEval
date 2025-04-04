<template>
  <div class="login-container">
    <div class="notice-text">
      尊敬的用户： EqualEval 提醒您，请先登录再使用
    </div>

    <div class="login-box">
      <h2>登录</h2>
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          show-icon
          :closable="false"
        />
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  username: '',
  password: ''
});
const error = ref('');
const loading = ref(false);

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const submitForm = async () => {
  try {
    loading.value = true;
    // 模拟登录验证（实际应调用后端API）
    if (form.value.username === 'admin' && form.value.password === 'admin') {
      userStore.setUserInfo({
        username: form.value.username,
        token: 'fake_token_123'
      });
      router.push('/task');
      return;
    }
    throw new Error('用户名或密码错误');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  flex-direction: column; /* 垂直排列内容 */
  align-items: center;
  height: 70vh;
  background: url('@/assets/images/login-bg2.png') no-repeat center center;
  background-size: cover; /* 自适应容器大小，不裁剪 */
  background-attachment: fixed; /* 固定背景防止滚动 */
  overflow: hidden; /* 防止内容溢出 */
}

.notice-text {
  margin: 40px 30px; 
  font-size: 20px;
  color: #1a2a40;
  font-weight: 550;
  text-align: left;
}

.login-box {
  width: 360px;
  padding: 30px; /* 增加内边距与背景图区分 */
  background: rgba(255, 255, 255, 0.9); /* 半透明背景 */
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px); /* 毛玻璃效果 */

  h2 {
    margin-bottom: 20px;
    text-align: center;
    color: #1a2a40;
  }

  .el-form {
    .el-form-item {
      margin-bottom: 24px;
    }

    .el-button {
      width: 100%;
    }
  }
}
</style>