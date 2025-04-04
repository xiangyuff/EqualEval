export default {
  getTaskDetail: (options) => {
    const { task_id } = JSON.parse(options.body);
    const taskDetails = [
      {
        task_id: "a1b2c3",
        task_name: "任务1-gpt4o-教育能力测评任务组",
        status: 0,
        task_group_label: "教育能力测评任务组",
        model_name: "GPT-4o",
        dataset_name: "教育数据集",
        create_time: "2023-11-01 09:00:00",
        start_time: null,
        end_time: null,
        progress: { completed_count: 0, total_count: 100, duration: "0秒" },
        result_url: "http://example.com/results/1.csv",
        report_url: "http://example.com/reports/1.pdf"
      },
      {
        task_id: "x7y8z9",
        task_name: "任务2-claude3o-医疗诊断优化任务组",
        status: 1,
        task_group_label: "医疗诊断优化任务组",
        model_name: "Claude 3 Opus",
        dataset_name: "医疗数据集",
        create_time: "2023-11-02 10:00:00",
        start_time: "2023-11-02 10:15:00",
        end_time: null,
        progress: { completed_count: 45, total_count: 100, duration: "30分钟" },
        result_url: "http://example.com/results/1.csv",
        report_url: "http://example.com/reports/1.pdf"
      },
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
        result_url: "http://example.com/results/1.csv",
        report_url: "http://example.com/reports/1.pdf"        
      },
      // 任务4
      {
        task_id: "q9r0s1",
        task_name: "任务4-gemini-法律文本分析任务组",
        status: 3,
        task_group_label: "法律文本分析任务组",
        model_name: "Gemini Pro",
        dataset_name: "法律数据集",
        create_time: "2023-11-04 12:00:00",
        start_time: "2023-11-04 12:10:00",
        end_time: "2023-11-04 12:30:00",
        progress: { completed_count: 20, total_count: 100, duration: "20分钟" },
        result_url: "http://example.com/results/1.csv",
        report_url: "http://example.com/reports/1.pdf"
      },
    ];
    const task = taskDetails.find(t => t.task_id === task_id);
    if (task) {
      return {
        code: 200,
        message: "success",
        data: task
      };
    } else {
      return {
        code: 404,
        message: "Task not found",
        data: null
      };
    }
  }
};