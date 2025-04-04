<template>
  <div class="container">
    <div class="header-actions">
      <h3>任务列表</h3>
      <el-button 
        type="primary" 
        icon="Plus" 
        @click="handleCreateTask"
        style="margin-left: 20px;"
      >
        创建
      </el-button>
    </div>

    <!-- 筛选区域 -->
    <div class="filters">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">搜索任务</span>
          <el-input
            v-model="filterForm.task_name"
            placeholder="请输入任务名称"
            style="width: 250px; margin-right: 10px;"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="filter-item">
          <span class="filter-label">任务组标签</span>
          <el-select
            v-model="filterForm.task_group_label"
            placeholder="请选择任务组"
            clearable
            style="width: 250px; margin-right: 10px;"
          >
            <el-option
              v-for="item in groupOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">任务状态</span>
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 250px; margin-right: 10px;"
          >
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </div>

        <div class="filter-item"  style="width: 500px;">
          <span class="filter-label">创建时间</span>
          <el-date-picker
            v-model="filterForm.create_time_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 300px; margin-right: 10px;"
          />
        </div>
      </div>
    </div>

    <div class="total-count">
      <span>总计 {{ total }} 个结果</span>
    </div>

    <!-- 任务列表 -->
    <div class="table-container">
      <el-table
        :data="paginatedTasks"
        style="width: 100%"
      >
        <el-table-column
          prop="task_id"
          label="任务ID"
          min-width="120"
        />
        <el-table-column
          prop="task_name"
          label="任务名称"
          min-width="200"
        />
        <el-table-column
          prop="status"
          label="任务状态"
          min-width="120"
        >
          <template #default="scope">
            <span class="status-indicator" :style="{ backgroundColor: statusColorMap[scope.row.status] }"></span>
            {{ statusMap.get(scope.row.status) || '未知' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="progress"
          label="任务进度"
          min-width="200"
        >
          <template #default="scope">
            <el-progress
              :percentage="calculateProgress(scope.row)"
              :status="scope.row.progress.status"
            />
            <span class="progress-text">
              {{ scope.row.progress.completed_count }}/{{ scope.row.progress.total_count }} 
              (耗时 {{ scope.row.progress.duration }}) 
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="task_group_label"
          label="任务组标签"
          min-width="150"
        />
        <el-table-column
          prop="model_name"
          label="关联模型"
          min-width="150"
        />
        <el-table-column
          prop="dataset_name"
          label="关联数据集"
          min-width="150"
        />
        <el-table-column
          prop="create_time"
          label="创建时间"
          min-width="180"
        />
        <el-table-column
          prop="start_time"
          label="开始时间"
          min-width="180"
        />
        <el-table-column
          prop="end_time"
          label="结束时间"
          min-width="180"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="240"
        >
          <template #default="scope">
            <el-button
              type="text"
              @click="handleViewDetail(scope.row.task_id)"
            >
              查看
            </el-button>
            <!-- 删除按钮：状态0或3时显示 -->
            <el-button
              v-if="[0, 3].includes(scope.row.status)"
              type="text"
              @click="handleDelete(scope.row.task_id)"
              style="margin-left: 10px;"
            >
              删除
            </el-button>
            <!-- 重新执行按钮：仅状态3时显示 -->
            <el-button
              v-if="scope.row.status === 3"
              type="text"
              @click="handleRetry(scope.row.task_id)"
              style="margin-left: 10px;"
            >
              重新执行
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="page.pageNum"
        @current-change="handlePageChange"
        style="margin: 20px 10px 50px 0; text-align: center;"
      />
    </div>

    <!-- 创建任务弹窗 -->
    <el-dialog
      v-model="isDialogVisible"
      title="创建任务"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="create-task-dialog"
    >
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="rules"
        label-position="left"
        label-width="33%"
      >
        <el-row :gutter="20">
          <!-- 任务组标签 -->
          <el-form-item label="任务组标签" prop="task_group_label">
            <el-col :span="16">
              <el-input
                v-model="createForm.task_group_label"
                placeholder="请输入任务组标签"
                clearable
              />
              <span class="form-help">
                本次批量创建的任务都有相同的任务组标签，便于后期筛选出本组任务来查看。
              </span>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          
        </el-row>

        <el-row :gutter="20">
          <!-- 数据集选择 -->
          <el-form-item label="选择数据集" prop="dataset_id">
            <el-col :span="16">
              <el-select
                v-model="createForm.dataset_id"
                placeholder="请选择一个数据集"
                filterable
                clearable
              >
                <el-option
                  v-for="dataset in datasets"
                  :key="dataset.dataset_id"
                  :label="dataset.dataset_name"
                  :value="dataset.dataset_id"
                />
              </el-select>
              <span class="form-help">单选</span>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <!-- 模型选择 -->
          <el-form-item label="选择模型" prop="model_ids">
            <el-col :span="16">
              <el-select
                v-model="createForm.model_ids"
                placeholder="请选择一个或多个模型"
                multiple
                filterable
              >
                <el-option
                  v-for="model in models"
                  :key="model.model_id"
                  :label="model.model_name"
                  :value="model.model_id"
                />
              </el-select>
              <span class="form-help">支持多选</span>
            </el-col>
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <!-- 执行时机 -->
          <el-form-item label="执行时机" prop="execution_time">
            <el-col :span="16">
              <el-radio-group v-model="createForm.execution_time">
                <el-radio label="立即执行">立即执行</el-radio>
                <el-radio label="暂不执行">暂不执行</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确认创建
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onUnmounted, computed,  } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const router = useRouter();

// 定时器存储
const progressInterval = ref(null);

// 创建任务表单相关变量
const isDialogVisible = ref(false);
const submitting = ref(false);
const createFormRef = ref();
const createForm = reactive({
  task_group_label: '',
  dataset_id: null,
  model_ids: [],
  execution_time: '立即执行',
});

const rules = {
  task_group_label: [
    { required: true, message: '请输入任务组标签', trigger: 'blur' }
  ],
  dataset_id: [
    { required: true, message: '请选择数据集', trigger: 'change' }
  ],
  model_ids: [
    { type: 'array', required: true, message: '请选择至少一个模型', trigger: 'change' }
  ],
};

// 创建任务表单的数据集和模型选项
const datasets = ref([]);
const models = ref([]);

const filterForm = ref({
  task_name: '',
  task_group_label: '',
  status: null,
  create_time_range: [],// [startTime, endTime]
});

const statusOptions = ref([
  { value: 0, label: '待执行' },
  { value: 1, label: '执行中' },
  { value: 2, label: '已完成' },
  { value: 3, label: '失败' },
]);

const statusColorMap = ref({
  0: '#99CCFF',
  1: '#2079FF',
  2: '#67c23a',
  3: '#FF9966',
});

const statusMap = ref(new Map([
  [0, '待执行'],
  [1, '执行中'],
  [2, '已完成'],
  [3, '失败'],
]));

const page = ref({
  pageNum: 1,
});

const pageSize = 10;// 固定每页10条

const tasks = ref([]);
const groupOptions = ref([]); 

// 更新任务进度接口
const updateTaskProgress = async (taskId) => {
  try {
    const res = await proxy.$api.getTaskProgress(taskId);
    return res.progress;
  } catch (error) {
    console.error('获取任务进度失败:', error);
    return null;
  }
};

// 定时轮询任务进度
const startProgressPolling = () => {
  progressInterval.value = setInterval(async () => {
    // 只轮询正在执行中的任务
    const activeTasks = tasks.value.filter(task => task.status === 1);
    await Promise.all(
      activeTasks.map(async task => {
        const progress = await updateTaskProgress(task.task_id);
        if (progress) {
          const index = tasks.value.findIndex(t => t.task_id === task.task_id);
          if (index !== -1) {
            tasks.value[index].progress = progress;
          }
        }
      })
    );
  }, 10000); // 每10秒轮询
};

// 计算当前页显示的数据
const filteredTasks = computed(() => {
  // 1. 应用筛选条件
  let filtered = tasks.value;

  // 任务名称过滤
  if (filterForm.value.task_name) {
    const keyword = filterForm.value.task_name.toLowerCase();
    filtered = filtered.filter(task => task.task_name.toLowerCase().includes(keyword));
  }

  // 任务组标签过滤
  if (filterForm.value.task_group_label) {
    filtered = filtered.filter(task => task.task_group_label === filterForm.value.task_group_label);
  }

  // 状态过滤
  if (filterForm.value.status !== null) {
    filtered = filtered.filter(task => task.status === filterForm.value.status);
  }

  // 创建时间范围过滤
  if (filterForm.value.create_time_range.length === 2) {
    const [start, end] = filterForm.value.create_time_range;
    const startTime = start.getTime();
    const endTime = end.getTime();
    filtered = filtered.filter(task => {
      const taskTime = new Date(task.create_time).getTime();
      return taskTime >= startTime && taskTime <= endTime;
    });
  }

  return filtered; // 返回未分页的完整筛选结果
});

const total = computed(() => filteredTasks.value.length);
const paginatedTasks = computed(() => {
  const start = (page.value.pageNum - 1) * pageSize;
  const end = page.value.pageNum * pageSize;
  return filteredTasks.value.slice(start, end);
});

// 计算进度百分比
const calculateProgress = (row) => {
  return row.progress.total_count > 0 
    ? Math.floor((row.progress.completed_count / row.progress.total_count) * 100) 
    : 0;
};

// 数据获取
const fetchData = async () => {
  try {
    const data = await proxy.$api.getTaskList();
    tasks.value = data.tableData || [];
    // 统计任务组标签选项
    const groupLabels = tasks.value.map(task => task.task_group_label);
    const uniqueGroups = [...new Set(groupLabels)];
    groupOptions.value = uniqueGroups;
  } catch (error) {
    console.error('获取任务列表失败:', error);
  }
};

// 筛选逻辑
const handleFilter = () => {
  page.value.pageNum = 1;
};

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    task_name: '',
    task_group_label: '',
    status: null,
    create_time_range: [],
  };
  page.value.pageNum = 1;
};

// 分页页码变化处理
const handlePageChange = (num) => {
  page.value.pageNum = num;
};

// 查看任务详情页
const handleViewDetail = (taskId) => {
  router.push(`/task/taskdetail/${taskId}`);
};

// 删除任务
const handleDelete = async (taskId) => {
  try {
    await proxy.$api.deleteTask(taskId);
    fetchData();
    ElMessage.success('任务删除成功');
  } catch (error) {
    console.error('删除任务失败:', error);
    ElMessage.error('删除失败，请重试');
  }
};

// 重新执行任务
const handleRetry = async (taskId) => {
  try {
    await proxy.$api.retryTask(taskId);
    fetchData();
    ElMessage.success('任务已重新执行');
  } catch (error) {
    console.error('重新执行任务失败:', error);
    ElMessage.error('操作失败，请检查任务状态');
  }
};

// 创建任务
const handleCreateTask = () => {
  // 预加载数据集和模型
  Promise.all([
    fetchDatasets(),
    fetchModels(),
  ]).then(() => {
    isDialogVisible.value = true;
  });
};

const handleClose = () => {
  resetForm();
  isDialogVisible.value = false;
};

const handleSubmit = () => {
  createFormRef.value.validate(async valid => {
    if (valid) {
      submitting.value = true;
      try {
        const params = {
          ...createForm,
          // 可能需要转换执行时机格式
          execution_time: createForm.execution_time === '立即执行' ? 1 : 0,
        };
        // console.log('创建任务参数：',params);
        await proxy.$api.createTask(params);
        ElMessage.success('任务创建成功');
        resetForm();
        isDialogVisible.value = false;
        // 刷新列表
        fetchData();
      } catch (error) {
        console.error('创建任务失败:', error);
        ElMessage.error('创建失败，请检查输入内容');
      } finally {
        submitting.value = false;
      }
    }
  });
};

const resetForm = () => {
  createForm.task_group_label = '';
  createForm.dataset_id = null;
  createForm.model_ids = [];
  createForm.execution_time = '立即执行';
  createFormRef.value?.resetFields();
};

// 创建任务表单-数据获取方法
const fetchDatasets = async () => {
  try {
    const data = await proxy.$api.getDatasetList();
    datasets.value = data.tableData || [];
  } catch (error) {
    console.error('获取数据集列表失败:', error);
  }
};

const fetchModels = async () => {
  try {
    const data = await proxy.$api.getModelList();
    models.value = data.tableData || [];
  } catch (error) {
    console.error('获取模型列表失败:', error);
  }
};

// 初始化加载
onMounted(() => {
  fetchData();
  // 初始化加载数据集和模型
  Promise.all([
    fetchDatasets(),
    fetchModels(),
  ]);
  startProgressPolling(); // 启动进度轮询
});

onUnmounted(() => {
  clearInterval(progressInterval.value); // 组件卸载时清除定时器
});

</script>

<style lang="less" scoped>
.create-task-dialog {
  .el-dialog__body {
    padding: 20px 30px 0;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}

/* 灯箱效果样式 */
.create-task-dialog::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  z-index: 1;
}

.create-task-dialog .el-dialog {
  background: rgba(255,255,255,0.95);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 8px;
  z-index: 2;
}
/* 帮助文案样式 */
.form-help {
  display: block;
  margin-top: 5px;
  color: #999;
  font-size: 12px;
}
/* 调整表单元素间距 */
.el-form-item {
  width: 600px;
  margin: 10px 50px;
}

.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 10px 20px 20px 10px;
  margin-bottom: 20px;

  .header-actions {
    display: flex;
    align-items: center;
    margin: 20px 10px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 550;
      color: #144e7d;
    }
  }

  .filters {
    margin: 20px 0 10px 20px;
    display: flex;
    flex-direction: column;
  }

  .filter-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 15px;
  }

  .filter-item {
    display: flex;
    align-items: center;
    width: 350px;
    margin-right: 50px;
  }

  .filter-label {
    margin-right: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #616161;
  }

  .total-count {
    margin: 5px 0 5px 20px;
    font-size: 13px;
    color: #606266;
  }

  .table-container {
    .el-table {
      margin: 0 0 10px 10px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
    }

    :deep(.el-table th) {
      background-color: rgb(230, 239, 252);
      color: #113e7c;
      font-size: 14px;
      font-weight: 500;
    }

    :deep(.el-table td) {
      color: #606266;
    }

    :deep(.el-table .cell) {
      padding: 5px 0 5px 20px;
    }

    .status-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: middle;
    }

    .progress-text {
      display: block;
      margin-top: 5px;
      font-size: 13px;
      color: #606266;
    }

    .el-table-column--right {
      .cell {
        display: flex;
        gap: 10px;
      }
    }

    .el-pagination {
      flex-direction: row;
      justify-content: flex-end;
    }
  }
}
</style>