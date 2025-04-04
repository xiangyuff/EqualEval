<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 路径映射规则
const pathsMapping = {
  '/task': '任务管理',
  '/dataset': '数据集管理',
  '/model': '模型管理',
  '/report': '结果报告',
  '/task/taskdetail': '任务详情',
  '/dataset/datasetdetail': '数据集详情',
  '/model/modeldetail': '模型详情'
};

// 动态计算面包屑路径
const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean); // 去除空字符串
  const result = [];
  let currentPath = '';
  let currentSegments = [];
  
  for (const segment of pathSegments) {
    currentSegments.push(segment);
    currentPath = `/${currentSegments.join('/')}`;
    
    if (currentPath in pathsMapping) {
      result.push({
        path: currentPath,
        label: pathsMapping[currentPath],
        isCurrent: currentSegments.length === pathSegments.length
      });
    }
  }
  
  // 确保最后一项标记为当前页
  if (result.length > 0) {
    result[result.length - 1].isCurrent = true;
  }
  
  return result;
});
</script>

<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="item in breadcrumbs"
        :key="item.path"
        :to="item.isCurrent ? undefined : item.path"
        :class="{ 'is-current': item.isCurrent }"
      >
        {{ item.label }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 25px;
  overflow: hidden;
  background-color: transparent;
}

.el-breadcrumb {
  margin-bottom: 20px;
  .is-current {
    color: #606266;
    cursor: default;
  }
}
</style>