<template>
  <el-aside>
    <el-menu
      background-color="#fff"
      text-color="#30314D"
      active-text-color="#3E5DFE"
      router=true
      default-active="/task"
    >
      <el-menu-item
        v-for="item in list"
        :index="item.path"
        :key="item.path"
      >
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>

      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref } from 'vue';

const list =ref([
  {
    path: '/task',
    name: 'task',
    label: '任务',
    icon: 'Paperclip',
    url: 'Task'
  },
  {
    path: '/dataset',
    name: 'dataset',
    label: '数据集',
    icon: 'Coin',
    url: 'Dataset'
  },
  {
    path: '/model',
    name: 'model',
    label: '模型',
    icon: 'Cpu',
    url: 'Model'
  },
  {
    path: '/report',
    name: 'report',
    label: '结果报告',
    icon: 'DataLine',
    url: 'Report'
  },
]);

</script>

<style lang="less" scoped>
.el-aside {
  height: 100%;
  width: 100%;
  margin-top: 2px;
  border-right: none;
}

.el-menu {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-right: none;
}

.el-menu-item {
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 6px 4px 6px 4px;
  .icons {
  width: 20px;
  height: 20px;
  margin-top: 10px;
  }
  span {
    line-height: 45px;
    font-size: 14px;
    font-family: '黑体';
  }

  &.is-active {
    background-color: #e6edf8;
    border-radius: 12px;
  }

  &:hover {
    background-color: #f0f0f0;
    border-radius: 12px;
  }
}
</style>