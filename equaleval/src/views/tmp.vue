<template>
  <div class="container">
    <!-- 筛选区域 -->
    <div class="filter-bar">
      <el-form :model="filterForm" inline @submit.prevent="handleFilter">
        <el-form-item label="任务名称">
          <el-input v-model="filterForm.task_name" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item label="任务组标签">
          <el-select v-model="filterForm.task_group_label" placeholder="请选择任务组" clearable>
            <el-option
              v-for="item in groupOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="filterForm.create_time_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 任务列表 -->
    <div class="table-container">
      <el-table
        :data="filteredTasks"
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

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :total="total"
          :current-page="page.pageNum"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

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

const pageSize = 20;// 固定每页20条

const tasks = ref([]);

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
  // 2. 应用分页
  const start = (page.value.pageNum - 1) * pageSize;
  const end = page.value.pageNum * pageSize;
  return filtered.slice(start, end);
});

const total = computed(() => filteredTasks.value.length * pageSize);

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
  } catch (error) {
    console.error('获取任务列表失败:', error);
  }
};

// 初始化加载
onMounted(() => {
  fetchData();
});

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
  router.push(`/task/detail/${taskId}`);
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
</script>

<style lang="less" scoped>
.container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;

  .filter-bar {
    margin-bottom: 20px;
    background: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
  }

  .table-container {
    .el-table {
      margin-bottom: 20px;
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

    .pagination {
      text-align: right;
    }
  }
}
</style>