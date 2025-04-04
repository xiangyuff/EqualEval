// api management of the project
import request from "./request";

//请求表格数据
export default {
  getTaskList() {
    return request({
      url: "/task/list",
      method: "post",
      data: {}
    });
  },
  creatTask(params) {
    return request({
      url: "/task/create",
      method: "post",
      data: params,
    });
  },
  getTaskProgress(taskId) {
    return request({
      url: '/task/progress',
      method: 'post',
      data: { task_id: taskId }
    });
  },
  deleteTask(task_id) {
    return request({
      url: "/task/delete",
      method: "post",
      data:{
        "task_id": task_id,
      },
    });
  },
  retryTask(task_id) {
    return request({
      url: "/task/retry",
      method: "post",
      data:{
        "task_id": task_id,
      },
    });
  },
  getTaskDetail(task_id) {
    return request({
      url: "/task/detail",
      method: "post",
      data:{
        "task_id": task_id,
      },
    });
  },
  getCompletedTasks() {
    return request({
      url: "/result/completed-tasks",
      method: "post",
      data: {}
    });
  },
  saveTask(task_id) {
    return request({
      url: "/result/save",
      method: "post",
      data:{
        "task_id": task_id,
      },
    });
  },
  batchSaveTasks(task_ids) {
    return request({
      url: "/result/batch-save",
      method: "post",
      data:{
        "task_ids": task_ids,
      },
    });
  },
  exportTask(params) {
    return request({
      url: "/result/export",
      method: "post",
      data: params,
    });
  },
  batchExportTasks(params) {
    return request({
      url: "/result/batch-export",
      method: "post",
      data: params,
    });
  },  
  getDatasetList() {
    return request({
      url: "/dataset/list",
      method: "post",
      data: {}
    });
  },
  getDatasetDetail(dataset_id) {
    return request({
      url: "/dataset/detail",
      method: "post",
      data:{
        "dataset_id": dataset_id,
      },
    });
  },
  getModelList() {
    return request({
      url: "/model/list",
      method: "post",
      data: {}
    });
  },
  getModelDetail(model_id) {
    return request({
      url: "/model/detail",
      method: "post",
      data:{
        "model_id": model_id,
      },
    });
  },
}