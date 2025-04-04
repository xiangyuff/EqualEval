<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const tableData = ref([]);
const tableLabel = ref({
  dataset_id: "数据集ID",
  dataset_name: "数据集名称",
  labels: "标签",
  size: "大小",
  type: "类型",
  usage_count: "使用次数",
  upload_time: "上传时间",
});

const searchKeyword = ref('');
const selectedLabels = ref([]);
const selectedType = ref('');

const allLabels = ref([]);
const allTypes = ref([]);

const currentPage = ref(1);
const pageSize = ref(10);

const getTableData = async () => {
  try {
    const data = await proxy.$api.getDatasetList();
    tableData.value = data.tableData || [];
    // 初始化所有标签和类型
    allLabels.value = [...new Set(data.tableData.flatMap(item => item.labels))];
    allTypes.value = [...new Set(data.tableData.map(item => item.type))];
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

onMounted(() => {
  getTableData();
});

const handleCheck = (index, row) => {
  // 使用 router.push 跳转到数据集详情页
  router.push({ name: 'DatasetDetail', params: { dataset_id: row.dataset_id } });
};

const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    const matchesSearch = item.dataset_name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    const matchesLabels = selectedLabels.value.length === 0 || selectedLabels.value.every(label => item.labels.includes(label));
    const matchesType = selectedType.value === '' || item.type === selectedType.value;
    return matchesSearch && matchesLabels && matchesType;
  });
});

// 获取当前页的数据
const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTableData.value.slice(start, end);
});

// 在表格上方添加显示筛选后数据总数的元素
const total = computed(() => {
  return filteredTableData.value.length;
});

const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="container">
    <h3>数据集列表</h3>

    <div class="filters">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">搜索数据集</span>
          <el-input
            v-model="searchKeyword"
            placeholder="数据集名称"
            style="width: 250px; margin-right: 10px;"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">筛选类型</span>
          <el-select
            v-model="selectedType"
            placeholder="请选择"
            clearable
            style="width: 250px; margin-right: 10px;"
          >
            <el-option
              v-for="type in allTypes"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">筛选标签</span>
          <el-select
            v-model="selectedLabels"
            multiple
            placeholder="请选择"
            clearable
            style="width: 250px; margin-right: 10px;"
          >
            <el-option
              v-for="label in allLabels"
              :key="label"
              :label="label"
              :value="label"
            />
          </el-select>
        </div>
      </div>
    </div>

    <div class="total-count">
      <span>总计 {{ total }} 个结果</span>
    </div>

    <el-table
      :data="paginatedTableData"
    >
      <el-table-column
        v-for="(val, key) in tableLabel"
        :key="key"
        :prop="key"
        :label="val"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" plain size="small" @click="handleCheck(scope.$index, scope.row)">
            查看
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
      :current-page="currentPage"
      @current-change="handlePageChange"
      style="margin: 20px 10px 50px 0; text-align: center;"
    />
  </div>
</template>

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
  }

  .filter-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 350px;
    margin-bottom: 10px;
    margin-right: 50px;
  }

  .filter-label {
    // width: 90px;
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

  .el-input__icon {
    margin-right: 5px;
    color: #8f8f8f;
  }

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
  .el-pagination {
    flex-direction: row;
    justify-content: flex-end;
  }
  
}
</style>