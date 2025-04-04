import Mock from "mockjs";
import datasetApi from "./mockData/datasetlist";
import taskApi from "./mockData/tasklist";
import modelApi from "./mockData/modellist";
import datasetDetailApi from "./mockData/datasetdetail";
import modelDetailApi from "./mockData/modeldetail";
import completedTaskApi from "./mockData/completedtasks";
import taskDetailApi from "./mockData/taskdetail";


// 拦截路径，方法，mock数据
Mock.mock("/dataset/list", "post", datasetApi.getDatasetList);
Mock.mock("/task/list", "post", taskApi.getTaskList);
Mock.mock("/model/list", "post", modelApi.getModelList);
Mock.mock("/dataset/detail", "post", datasetDetailApi.getDatasetDetail);
Mock.mock("/model/detail", "post", modelDetailApi.getModelDetail);
Mock.mock("/result/completed-tasks", "post", completedTaskApi.getCompletedTasks);
Mock.mock("/task/detail", "post", taskDetailApi.getTaskDetail);