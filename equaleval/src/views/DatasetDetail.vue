<template>
  <div class="container">
    <h3>数据集详情 - {{ basicInfo?.dataset_name }}</h3>

    <div class="content-module" v-if="basicInfo">
      <h4>基本信息</h4>
      <div class="concrete-content">
        <div class="info-column">
          <p><strong>数据集ID:</strong> {{ dataset_id }}</p>
          <p><strong>数据集名称:</strong> {{ basicInfo.dataset_name }}</p>
          <p><strong>标签:</strong> {{ basicInfo.labels.join(', ') }}</p>
          <p><strong>大小:</strong> {{ basicInfo.size }}</p>
          <p><strong>类型:</strong> {{ basicInfo.type }}</p>
        </div>
        <div class="info-column">
          <p><strong>使用次数:</strong> {{ basicInfo.usage_count }}</p>
          <p><strong>上传时间:</strong> {{ basicInfo.upload_time }}</p>
          <p><strong>描述:</strong> {{ basicInfo.description }}</p>
          <p><strong>来源:</strong> {{ basicInfo.source }}</p>
          <p><strong>授权信息:</strong> {{ basicInfo.license }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>

    <div class="content-module" v-if="previewTableLabel">
      <h4 class="preview-header">
        <span>数据预览</span>
        <span class="preview-description">| 对于表格数据，展示前10行数据。对于文本数据，展示前500个字符。</span>
      </h4>
      <div class="concrete-content">
        <el-card class="box-card">
          <el-table :data="previewTabledata" style="width: 100%;">
            <el-table-column
              v-for="column in previewTableLabel"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              width="auto">
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>

    <!-- 可视化数据统计部分本期暂不展示 -->
    <!-- <div class="content-module" v-if="basicInfo">
      <h4>数据统计</h4>
      <div class="concrete-content">
        <div ref="barChart" class="chart" style="width: 50%; height: 400px;"></div>
        <div ref="pieChart" class="chart" style="width: 50%; height: 400px;"></div>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const route = useRoute();

const dataset_id = ref(null);
const basicInfo = ref(null);
const previewTabledata = ref(null);
const previewTableLabel = ref(null);

const barChart = ref(null);
const pieChart = ref(null);

// 调用 getDatasetDetail 方法
const getDatasetDetail = async (id) => {
  try {
    const data = await proxy.$api.getDatasetDetail(id); 
    dataset_id.value = data.dataset_id;
    basicInfo.value = data.basicData;
    previewTabledata.value = data.previewTabledata;
    previewTableLabel.value = data.previewTableLabel;

    // console.log("datasetdetail:", data);

    // 初始化图表
    initCharts();
  } catch (error) {
    console.error("获取数据集详情失败:", error);
  }
};

const initCharts = async () => {
  await nextTick();

  // 柱状图数据
  const barChartData = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }]
  };

  // 饼状图数据
  const pieChartData = {
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // 初始化柱状图
  const barChartInstance = proxy.$echarts.init(barChart.value);
  barChartInstance.setOption(barChartData);

  // 初始化饼状图
  const pieChartInstance = proxy.$echarts.init(pieChart.value);
  pieChartInstance.setOption(pieChartData);
};

onMounted(() => {
  getDatasetDetail(route.params.dataset_id);
});

watch(
  () => route.params.dataset_id,
  (newId) => {
    getDatasetDetail(newId);
  }
);
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
            background-color: #e0edfa; /* 浅蓝色背景 */
            border: 1px solid #b2d3f2; /* 浅蓝色边框 */
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-block;
            color: #144e7d;
            font-size: 14px;
          }
        }
      }

      .chart {
        display: inline-block;
        vertical-align: top;
      }

      .el-table th {
        background-color: #f5f7fa;
      }

      .el-table td {
        padding: 12px 0;
      }

      .el-table .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .box-card {
        width: 90%;
        margin-top: 20px;
      }
    }
  }
}
</style>