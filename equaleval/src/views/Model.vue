<template>
  <div class="container">
    <h3>模型列表</h3>

    <div class="filters">
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">搜索模型</span>
          <el-input
            v-model="searchKeyword"
            placeholder="模型名称"
            style="width: 250px; margin-right: 10px;"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="filter-item">
          <span class="filter-label">筛选机构</span>
          <el-select
            v-model="selectedInstitution"
            placeholder="请选择"
            clearable
            style="width: 250px; margin-right: 10px;"
          >
            <el-option
              v-for="institution in allInstitutions"
              :key="institution"
              :label="institution"
              :value="institution"
            />
          </el-select>
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
          <span class="filter-label">是否开源</span>
          <el-select
            v-model="selectedIsOpenSource"
            placeholder="请选择"
            clearable
            style="width: 250px; margin-right: 10px;"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-item" style="width: 500px;">
          <span class="filter-label" style="margin-right: 30px;">上传时间</span>
          <el-date-picker
            v-model="selectedTimeRange"
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

    <el-table
      :data="paginatedTableData"
    >
      <el-table-column
        v-for="(val, key) in tableLabel"
        :key="key"
        :prop="key"
        :label="val"
      >
        <template #default="scope" v-if="key === 'is_open_source'">
          {{ scope.row.is_open_source ? '是' : '否' }}
        </template>
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

<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const { proxy } = getCurrentInstance();
const router = useRouter();

const tableData = ref([]);
const tableLabel = ref({
  model_id: "模型ID",
  model_name: "模型名称", 
  institution: "开发机构",
  is_open_source: "是否开源",
  type: "模型类型",
  version: "版本号",
  usage_count: "使用次数",
  upload_time: "上传时间",
});

const searchKeyword = ref('');
const selectedInstitution = ref('');
const selectedType = ref('');
const selectedIsOpenSource = ref(null); // null 表示不限制
const selectedTimeRange = ref([]);

const allInstitutions = ref([]);
const allTypes = ref([]);

const currentPage = ref(1);
const pageSize = ref(10);

const getTableData = async () => {
  try {
    const data = await proxy.$api.getModelList();
    tableData.value = data.tableData || [];
    console.log(data.tableData);
    // 初始化所有机构和类型
    allInstitutions.value = [...new Set(data.tableData.map(item => item.institution))];
    allTypes.value = [...new Set(data.tableData.map(item => item.type))];
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

onMounted(() => {
  getTableData();
});

const handleCheck = (index, row) => {
  // 使用 router.push 跳转到模型详情页
  router.push({ name: 'ModelDetail', params: { model_id: row.model_id } });
};

const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    const matchesSearch = item.model_name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    const matchesInstitution = selectedInstitution.value === '' || item.institution === selectedInstitution.value;
    const matchesType = selectedType.value === '' || item.type === selectedType.value;
    const matchesIsOpenSource = selectedIsOpenSource.value === null || item.is_open_source === selectedIsOpenSource.value;
    const matchesTimeRange = selectedTimeRange.value.length === 0 || 
      (new Date(item.upload_time) >= selectedTimeRange.value[0] && new Date(item.upload_time) <= selectedTimeRange.value[1]);

    return matchesSearch && matchesInstitution && matchesType && matchesIsOpenSource && matchesTimeRange;
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