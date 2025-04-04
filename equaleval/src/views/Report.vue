<template>
  <el-dialog
    v-model="exportDialogVisible"
    title="导出设置"
    width="40%"
    @close="resetExportForm"
  >
    <el-form :model="exportForm" label-width="120px">
      <el-form-item label="导出内容类型">
        <el-radio-group v-model="exportForm.type">
          <el-radio label="result_data">结果明细</el-radio>
          <el-radio label="result_report">结果报告</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="导出格式">
        <el-radio-group v-model="exportForm.format">
          <template v-if="exportForm.type === 'result_data'">
            <el-radio label="csv">CSV</el-radio>
            <el-radio label="excel">Excel</el-radio>
          </template>
          <template v-else>
            <el-radio label="pdf">PDF</el-radio>
            <el-radio label="html">HTML</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="exportDialogVisible = false">取消</el-button>
      <el-button 
        type="primary" 
        :loading="exporting"
        @click="handleExportConfirm"
      >
        确认导出
      </el-button>
    </template>
  </el-dialog>

  <div class="container">
    <h3>已完成列表</h3>

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
          <span class="filter-label">关联模型</span>
          <el-select
            v-model="filterForm.model_name"
            placeholder="请选择模型"
            clearable
            style="width: 250px; margin-right: 10px;"
          >
            <el-option
              v-for="model in modelOptions"
              :key="model"
              :label="model"
              :value="model"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">关联数据集</span>
          <el-select
            v-model="filterForm.dataset_name"
            placeholder="请选择数据集"
            clearable
            style="width: 250px; margin-right: 10px;"
          >
            <el-option
              v-for="dataset in datasetOptions"
              :key="dataset"
              :label="dataset"
              :value="dataset"
            />
          </el-select>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-item" style="width: 500px;">
          <span class="filter-label">结束时间</span>
          <el-date-picker
            v-model="filterForm.end_time_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 300px; margin-right: 10px;"
          />
        </div>
      </div>
      
    </div>

    <!-- 批量操作按钮 -->
    <div class="batch-actions">
      <el-button type="primary" @click="batchExport">批量导出</el-button>
      <el-button @click="batchSave">批量保存</el-button>
    </div>

    <div class="total-count">
      <span>总计 {{ total }} 个结果</span>
    </div>

    <!-- 任务列表 -->
    <div class="table-container">
      <el-table
        :data="paginatedTasks"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 复选框列 -->
        <el-table-column type="selection" width="55" />

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
          width="320"
        >
          <template #default="scope">
            <!-- 查看按钮 -->
            <el-button
              type="text"
              @click="handleViewDetail(scope.row.task_id)"
            >
              查看
            </el-button>
            <!-- 保存按钮 -->
            <el-button 
              type="text" 
              :disabled="scope.row.is_saved" 
              @click="handleSave(scope.row)"
            >
              {{ scope.row.is_saved ? '已保存' : '保存' }}
            </el-button>
            <!-- 导出按钮 -->
            <el-button 
              type="text" 
              @click="handleExport(scope.row)"
            >
              导出
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
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const router = useRouter();
const selectedRows = ref([]);

// 导出对话框相关变量
const exportDialogVisible = ref(false);
const exportForm = ref({
  type: 'result_data', // 默认结果明细
  format: 'csv'       // 默认CSV格式
});
const exporting = ref(false); // 导出加载状态
const selectedTaskIds = ref([]); // 存储选中的任务ID

const filterForm = ref({
  task_name: '',
  task_group_label: '',
  model_name: '',
  dataset_name: '',
  end_time_range: [],
});

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
const modelOptions = ref([]);
const datasetOptions = ref([]);

// 重置导出表单
const resetExportForm = () => {
  exportForm.value = {
    type: 'result_data',
    format: 'csv'
  };
  selectedTaskIds.value = [];
  exporting.value = false;
};

// 处理导出确认
const handleExportConfirm = async () => {
  exporting.value = true;
  
  try {
    const taskIdList = selectedTaskIds.value.length 
      ? selectedTaskIds.value 
      : [selectedTask.task_id]; // 根据上下文判断单个/批量
    
    // 根据批量或单个调用不同接口
    let resdata;
    if (taskIdList.length > 1) {
      resdata = await proxy.$api.batchExportTasks({
        task_ids: taskIdList,
        type: exportForm.value.type,
        format: exportForm.value.format
      });
    } else {
      resdata = await proxy.$api.exportTask({
        task_id: taskIdList[0],
        type: exportForm.value.type,
        format: exportForm.value.format
      });
    }
    
    // 触发文件下载
    const url = URL.createObjectURL(new Blob([resdata]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `export.${exportForm.value.format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    ElMessage.success('导出成功');
    exportDialogVisible.value = false;
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败，请重试');
  } finally {
    exporting.value = false;
  }
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

  // 模型过滤
  if (filterForm.value.model_name) {
    filtered = filtered.filter(task => 
      task.model_name === filterForm.value.model_name
    );
  }

  // 数据集过滤
  if (filterForm.value.dataset_name) {
    filtered = filtered.filter(task => 
      task.dataset_name === filterForm.value.dataset_name
    );
  }

  // 结束时间过滤
  if (filterForm.value.end_time_range.length === 2) {
    const [start, end] = filterForm.value.end_time_range;
    const startTime = start.getTime();
    const endTime = end.getTime();
    filtered = filtered.filter(task => {
      const taskTime = new Date(task.end_time).getTime(); // 使用 end_time
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
    const data = await proxy.$api.getCompletedTasks();
    tasks.value = data.tableData.map(task => ({ ...task, is_saved: task.is_saved || false }));
    // 统计任务组标签选项
    const groupLabels = tasks.value.map(task => task.task_group_label);
    const uniqueGroups = [...new Set(groupLabels)];
    groupOptions.value = uniqueGroups;

    // 初始化模型选项
    const models = tasks.value.map(task => task.model_name);
    modelOptions.value = [...new Set(models)];

    // 初始化数据集选项
    const datasets = tasks.value.map(task => task.dataset_name);
    datasetOptions.value = [...new Set(datasets)];

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
    model_name: null,
    dataset_name: null,
    end_time_range: [],
  };
  page.value.pageNum = 1;
};

// 分页页码变化处理
const handlePageChange = (num) => {
  page.value.pageNum = num;
};

const handleViewDetail = (taskId) => {
  router.push(`/task/taskdetail/${taskId}`);
};

// 批量操作处理方法
const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};

// 实现单个任务导出逻辑
const handleExport = (row) => {
  selectedTaskIds.value = [row.task_id];
  exportDialogVisible.value = true;
};

// 批量任务导出方法
const batchExport = () => {
  const selected = selectedRows.value;
  if (selected.length === 0) {
    ElMessage.warning('请选择要导出的任务');
    return;
  }
  
  selectedTaskIds.value = selected.map(task => task.task_id);
  exportDialogVisible.value = true;
};

// 单个保存方法
const handleSave = async (row) => {
  if (row.is_saved) return; // 已保存则直接返回

  try {
    const taskId = row.task_id;
    await proxy.$api.saveTask(taskId); 
    
    // 更新本地状态
    const taskIndex = tasks.value.findIndex(task => task.task_id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex].is_saved = true;
    }
    
    ElMessage.success(`任务 ${taskId} 保存成功`);
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请检查网络');
  }
};

// 批量保存方法
const batchSave = async () => {
  const selectedTasks = selectedRows.value;
  if (selectedTasks.length === 0) {
    ElMessage.warning('请选择要保存的任务');
    return;
  }
  
  try {
    const taskIds = selectedTasks.map(task => task.task_id);
    await proxy.$api.batchSaveTasks({ taskIds });
    
    // 更新本地状态
    selectedTasks.forEach(task => {
      const taskIndex = tasks.value.findIndex(t => t.task_id === task.task_id);
      if (taskIndex !== -1) {
        tasks.value[taskIndex].is_saved = true;
      }
    });
    
    ElMessage.success(`批量保存成功，共 ${taskIds.length} 个任务`);
  } catch (error) {
    console.error('批量保存失败:', error);
    ElMessage.error('批量保存失败，请检查任务状态');
  }
};

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

.batch-actions {
  margin: 20px 20px 10px;
  text-align: left;
}

// 调整操作列按钮间距（确保与现有按钮对齐）
.el-table-column--right {
  .cell {
    display: flex;
    gap: 10px;
  }
}
</style>