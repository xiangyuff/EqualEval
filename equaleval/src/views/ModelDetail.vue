<template>
  <div class="container">
    <h3>模型详情 - {{ basicData?.model_name }}</h3>

    <div class="content-module" v-if="basicData">
      <h4>基本信息</h4>
      <div class="concrete-content">
        <div class="info-item">
          <span class="info-label">模型ID</span>
          <span class="info-value">{{ model_id }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">开发机构</span>
          <span class="info-value">{{ basicData.institution }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">是否开源</span>
          <span class="info-value">{{ basicData.is_open_source ? '是' : '否' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">类型</span>
          <span class="info-value">{{ basicData.type }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">版本</span>
          <span class="info-value">{{ basicData.version }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">使用次数</span>
          <span class="info-value">{{ basicData.usage_count }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">上传时间</span>
          <span class="info-value">{{ basicData.upload_time }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">描述</span>
          <span class="info-value">{{ basicData.description }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">文件信息</span>
          <div class="info-value">
            <ul>
              <li>权重文件: {{ basicData.files.weights }}</li>
              <li>配置文件: {{ basicData.files.config }}</li>
              <li>词表文件: {{ basicData.files.vocab }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>

    <div class="content-module" v-if="technical_parameters">
      <h4>技术参数</h4>
      <div class="concrete-content">
        <div class="info-item">
          <span class="info-label">架构</span>
          <span class="info-value">{{ technical_parameters.architecture }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">参数量</span>
          <span class="info-value">{{ technical_parameters.parameters }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">训练数据</span>
          <span class="info-value">{{ technical_parameters.training_data }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">训练方式</span>
          <span class="info-value">{{ technical_parameters.training_method }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">输入输出</span>
          <div class="info-value">
            <ul>
              <li>输入: {{ technical_parameters.input_output.input }}</li>
              <li>输出: {{ technical_parameters.input_output.output }}</li>
            </ul>
          </div>
        </div>
        <div class="info-item">
          <span class="info-label">硬件要求</span>
          <div class="info-value">
            <ul>
              <li>CPU: {{ technical_parameters.hardware_requirements.cpu }}</li>
              <li>GPU: {{ technical_parameters.hardware_requirements.gpu }}</li>
              <li>内存: {{ technical_parameters.hardware_requirements.memory }}</li>
              <li>存储: {{ technical_parameters.hardware_requirements.storage }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>

    <div class="content-module" v-if="evaluation_history">
      <h4>测评历史</h4>
      <div class="concrete-content">
        <el-table :data="evaluation_history" style="width: 100%;">
          <el-table-column
            v-for="(label, index) in evaluation_table_label"
            :key="index"
            :prop="label.prop"
            :label="label.label"
          />
        </el-table>
      </div>
    </div>
    <div v-else>
      <p>内容加载中...</p>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();

const route = useRoute();

const model_id = ref(null);
const basicData = ref(null);
const technical_parameters = ref(null);
const evaluation_history = ref(null);
const evaluation_table_label = ref(null);

const getModelDetail = async (id) => {
  try {
    // console.log("Requested model_id:", id); // 调试信息
    const data = await proxy.$api.getModelDetail(id);
    model_id.value = data.model_id;
    basicData.value = data.basicData;
    technical_parameters.value = data.technical_parameters;
    evaluation_history.value = data.evaluation_history;
    evaluation_table_label.value = data.evaluation_table_label;
    // console.log("modeldetail-data:", model);
  } catch (error) {
    console.error("获取模型详情失败:", error);
  }
};

onMounted(() => {
  getModelDetail(route.params.model_id);
});

watch(
  () => route.params.model_id,
  (newId) => {
    // console.log("Model ID changed to:", newId); // 调试信息
    getModelDetail(newId);
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
    }
    
    .concrete-content {
      display: flex;
      flex-wrap: wrap;

      .info-item {
        width: 50%;
        box-sizing: border-box;
        padding: 0 10px;
        margin-bottom: 10px;

        .info-label {
          background-color: #e0edfa; /* 浅蓝色背景 */
          border: 1px solid #b2d3f2; /* 浅蓝色边框 */
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          color: #144e7d;
          font-size: 14px;
          margin-right: 10px;
        }

        .info-value {
          font-size: 14px;
          color: #333333;

          ul {
            list-style-type: disc;
            padding-left: 20px;
            margin: 6px 0;

            li {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
}
</style>