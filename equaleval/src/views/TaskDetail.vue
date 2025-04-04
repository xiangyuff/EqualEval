<template>
  <div class="container">
    <h3>任务详情 - {{ basicInfo?.task_name }}</h3>
    
    <div class="content-module" v-if="basicInfo">
      <h4>基本信息</h4>
      <div class="concrete-content">
        <div class="info-column">
          <p><strong>任务ID:</strong> {{ basicInfo.task_id }}</p>
          <p><strong>任务名称:</strong> {{ basicInfo.task_name }}</p>
          <p><strong>任务组:</strong> {{ basicInfo.task_group_label }}</p>
          <p><strong>模型名称:</strong> {{ basicInfo.model_name }}</p>
        </div>
        <div class="info-column">
          <p><strong>数据集:</strong> {{ basicInfo.dataset_name }}</p>
          <p><strong>创建时间:</strong> {{ basicInfo.create_time }}</p>
          <p><strong>开始时间:</strong> {{ basicInfo.start_time || '未开始' }}</p>
          <p><strong>结束时间:</strong> {{ basicInfo.end_time || '进行中' }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>

    <!-- 执行进展模块 -->
    <div class="content-module" v-if="basicInfo">
      <h4>执行进展</h4>
      <div class="concrete-content">
        <div class="info-column">
          <p>
            <strong>任务状态:</strong>
            <span :class="statusClass">{{ statusText }}</span>
          </p>
          <p>
            <strong>已完成数:</strong> {{ basicInfo.progress?.completed_count || 0 }}
          </p>
          <p>
            <strong>总数:</strong> {{ basicInfo.progress?.total_count || 0 }}
          </p>
          <p>
            <strong>任务耗时:</strong> {{ basicInfo.progress?.duration || '0秒' }}
          </p>
          <div class="progress-bar">
            <el-progress 
              :percentage="progressPercentage" 
              :status="progressStatus" 
              :text-inside="true" 
              :stroke-width="24"
              style="width: 70%; margin-top: 20px;"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>

    <!-- 结果明细模块 -->
    <div class="content-module" v-if="basicInfo">
      <h4>结果明细</h4>
      <div class="concrete-content">
        <div class="info-column">
          <el-button 
            type="primary" 
            @click="downloadFile(basicInfo.result_url)"
            class="custom-export-btn"
          >
            导出结果明细
          </el-button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>

    <!-- 结果报告模块 -->
    <div class="content-module" v-if="basicInfo">
      <h4>结果报告</h4>
      <div class="concrete-content">
        <div class="info-column">
          <el-button 
            type="primary" 
            @click="downloadFile(basicInfo.report_url)"
            class="custom-export-btn"
          >
            导出结果报告
          </el-button>
          <!-- 图表 -->
          <div class="chart-container">
            <div ref="radarChart" class="chart" style="height: 400px;"></div>
            <div ref="barChart" class="chart" style="height: 400px;"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts';

const { proxy } = getCurrentInstance()
const route = useRoute()

const basicInfo = ref(null)

const radarChart = ref(null);
const barChart = ref(null);

const progressPercentage = computed(() => {
  if (!basicInfo.value?.progress || basicInfo.value.progress.total_count === 0) {
    return 0
  }
  return Math.floor((basicInfo.value.progress.completed_count / basicInfo.value.progress.total_count) * 100)
})

const progressStatus = computed(() => {
  if (basicInfo.value?.status === 2) return 'success' // 已完成
  if (basicInfo.value?.status === 1) return '' // 执行中
  if (basicInfo.value?.status === 0) return '' // 未开始
  return 'exception' // 失败
})

// 下载方法
const downloadFile = (url) => {
  const link = document.createElement('a')
  link.href = url
  link.download = url.split('/').pop()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getTaskDetail = async (id) => {
  try {
    const data = await proxy.$api.getTaskDetail(id)
    basicInfo.value = data
  } catch (error) {
    console.error("获取任务详情失败:", error)
  }
}

// 雷达图数据(先写死，后期再从API获取)
const radarData = {
  dimensions: ['知识维度', '应用能力', '分析能力', '综合评价'],
  scores: [85, 90, 78, 92],
  maxScores: [100, 100, 100, 100]
};

// 条形图数据(先写死，后期再从API获取)
const barData = [
  { name: '知识维度', value: 15 },
  { name: '应用能力', value: 20 },
  { name: '分析能力', value: 12 },
  { name: '综合评价', value: 10 }
];

// 初始化雷达图
const initRadar = () => {
  const radarChartInstance = echarts.init(radarChart.value);
  const radarOption = {
    title: { text: '题目维度评分雷达图' },
    radar: {
      indicator: radarData.dimensions.map(d => ({ name: d, max: 100 })),
      radius: '60%'
    },
    series: [{
      type: 'radar',
      data: [{
        value: radarData.scores,
        name: '当前得分',
        areaStyle: { color: 'rgba(55,162,240,0.3)' },
        lineStyle: { color: '#37a2ff' }
      }, {
        value: radarData.maxScores,
        name: '满分基准',
        lineStyle: { color: '#e6a23c', type: 'dashed' }
      }]
    }]
  };
  radarChartInstance.setOption(radarOption);
};

// 初始化条形图
const initBar = () => {
  const barChartInstance = echarts.init(barChart.value);
  const barOption = {
    title: { text: '题目数量分布' },
    xAxis: { type: 'category', data: barData.map(item => item.name) },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: barData.map(item => item.value),
      itemStyle: { color: '#5470c6' }
    }],
    grid: { left: '10%', right: '10%' }
  };
  barChartInstance.setOption(barOption);
};


onMounted(() => {
  getTaskDetail(route.params.task_id).then(() => {
    nextTick(() => {
      initRadar();
      initBar();
    });
  });
});

watch(
  () => route.params.task_id,
  (newId) => {
    getTaskDetail(newId).then(() => {
      nextTick(() => {
        initRadar();
        initBar();
      });
    });
  }
);

// 计算属性
const statusText = computed(() => {
  const statusMap = {
    0: '未开始',
    1: '进行中',
    2: '已完成',
    3: '失败'
  }
  return statusMap[basicInfo.value?.status] || '未知'
})

const statusClass = computed(() => {
  const status = basicInfo.value?.status
  return {
    'status-pending': status === 0,
    'status-running': status === 1,
    'status-success': status === 2,
    'status-error': status === 3
  }
})

const progressText = computed(() => {
  if (!basicInfo.value?.progress) return '0%'
  const { completed_count, total_count } = basicInfo.value.progress
  return total_count === 0 
    ? '0%' 
    : `${Math.floor((completed_count / total_count) * 100)}%`
})
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 10px 20px 20px 10px;
  margin-bottom: 20px;

  h3 {
    margin: 10px 5px;
    font-size: 18px;
    font-weight: 550;
    color: #144e7d;
  }

  .content-module {
    margin: 5px 5px;
    padding: 10px 0;
    border-bottom: 1px solid #d7d7d7;

    h4 {
      margin: 10px 0;
      font-size: 16px;
      font-weight: 550;
      color: #20639b;
      display: flex;
      align-items: center;

      .preview-description {
        margin-left: 10px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
      }
    }
    
    .concrete-content {
      display: flex;
      flex-wrap: wrap;

      .info-column {
        width: 50%;
        box-sizing: border-box;
        padding: 0 10px;
        p {
          margin: 6px 0;
          strong {
            margin-right: 8px;
            background-color: #e0edfa; /* 浅蓝色背景 */
            border: 1px solid #b2d3f2; /* 浅蓝色边框 */
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-block;
            color: #144e7d;
            font-size: 14px;
          }
          span {
            &.status-pending { color: #1890ff; }  // 蓝色
            &.status-running { color: #1890ff; }
            &.status-success { color: #52c41a; } // 绿色
            &.status-error { color: #f5222d; }   // 红色
          }
        }
      }

      .chart-container {
        margin-top: 20px;
        .chart {
          margin-bottom: 30px;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          padding: 10px;
          background: #fff;
        }
      }
    }
  }

  .progress-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    
    .status-display {
      font-size: 16px;
      font-weight: 550;
      span {
        padding: 6px 12px;
        border-radius: 4px;
      }
    }

    .progress-bar {
      .el-progress {
        margin-top: 5px;
        margin-bottom: 20px;
      }
    }

    .duration-display {
      font-size: 14px;
      color: #666;
    }
  }

  .custom-export-btn {
    background-color: white;          // 白色背景
    color: #144e7d;                  // 蓝色文字（与标签颜色一致）
    border: 1px solid #b2d3f2;       // 浅蓝色边框
    padding: 12px 24px;              // 适当内边距
    width: auto !important;          // 取消100%宽度
    margin-top: 5px;
    
    &:hover {
      background-color: #e1ebfb;      // 悬停浅蓝色背景
      border-color: #c6e2ff;         // 悬停边框色
    }
  }
}
</style>