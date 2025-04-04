export default {
  getCompletedTasks: () => {
    return {
      code: 200,
      data: {
        tableData: [
          // 任务3
          {
            task_id: "m5n6o7",
            task_name: "任务3-llama3-金融风控评估任务组",
            status: 2,
            task_group_label: "金融风控评估任务组",
            model_name: "Llama 3",
            dataset_name: "金融数据集",
            create_time: "2023-11-03 11:00:00",
            start_time: "2023-11-03 11:10:00",
            end_time: "2023-11-03 12:00:00",
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" },
            is_saved: true,
          },
          // 任务7
          {
            task_id: "z8a9b0",
            task_name: "任务7-commandr-用户行为研究任务组",
            status: 2,
            task_group_label: "用户行为研究任务组",
            model_name: "Command R+",
            dataset_name: "游戏数据集",
            create_time: "2023-11-07 15:00:00",
            start_time: "2023-11-07 15:10:00",
            end_time: "2023-11-07 16:00:00",
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" },
            is_saved: false,
          },
          // 任务11
          {
            task_id: "l0m1n2",
            task_name: "任务11-gpt4o-游戏数据分析任务组",
            status: 2,
            task_group_label: "游戏数据分析任务组",
            model_name: "GPT-4o",
            dataset_name: "游戏数据集",
            create_time: "2023-11-11 19:00:00",
            start_time: "2023-11-11 19:10:00",
            end_time: "2023-11-11 20:00:00",
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" },
            is_saved: false,
          },
          // 任务15
          {
            task_id: "x2y3z4",
            task_name: "任务15-yi34b-股票交易预测任务组",
            status: 2,
            task_group_label: "股票交易预测任务组",
            model_name: "Yi-34B",
            dataset_name: "金融数据集2",
            create_time: "2023-11-15 23:00:00",
            start_time: "2023-11-15 23:10:00",
            end_time: "2023-11-16 00:00:00",
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" },
            is_saved: false,
          },
          // 任务19
          {
            task_id: "j4k5l6",
            task_name: "任务19-phi3-数据清洗任务组",
            status: 2,
            task_group_label: "数据清洗任务组",
            model_name: "Phi-3-mini",
            dataset_name: "教育数据集2",
            create_time: "2023-11-19 03:00:00",
            start_time: "2023-11-19 03:10:00",
            end_time: "2023-11-19 04:00:00",
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" },
            is_saved: false,
          },
          // 任务23
          {
            task_id: "v6w7x8",
            task_name: "任务23-llama3-自然语言处理任务组",
            status: 2,
            task_group_label: "自然语言处理任务组",
            model_name: "Llama 3",
            dataset_name: "高级编程语言数据集",
            create_time: "2023-11-23 07:00:00",
            start_time: "2023-11-23 07:10:00",
            end_time: "2023-11-23 08:00:00",
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" },
            is_saved: false,
          },
        ],
      },
    };
  },
};