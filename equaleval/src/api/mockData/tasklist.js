export default {
  getTaskList: () => {
    return {
      code: 200,
      data: {
        tableData: [
          // 任务1
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
            progress: { completed_count: 0, total_count: 100, duration: "0秒" }
          },
          // 任务2
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
            progress: { completed_count: 45, total_count: 100, duration: "30分钟" }
          },
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
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" }
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
            progress: { completed_count: 20, total_count: 100, duration: "20分钟" }
          },
          // 任务5
          {
            task_id: "t2u3v4",
            task_name: "任务5-yi34b-环境监测预测任务组",
            status: 0,
            task_group_label: "环境监测预测任务组",
            model_name: "Yi-34B",
            dataset_name: "全球气候变化数据集",
            create_time: "2023-11-05 13:00:00",
            start_time: null,
            end_time: null,
            progress: { completed_count: 0, total_count: 0, duration: "0秒" }
          },
          // 任务6
          {
            task_id: "w5x6y7",
            task_name: "任务6-mistral7b-社交媒体分析任务组",
            status: 1,
            task_group_label: "社交媒体分析任务组",
            model_name: "Mistral 7B",
            dataset_name: "社交媒体用户行为分析数据集",
            create_time: "2023-11-06 14:00:00",
            start_time: "2023-11-06 14:15:00",
            end_time: null,
            progress: { completed_count: 65, total_count: 100, duration: "45分钟" }
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
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" }
          },
          // 任务8
          {
            task_id: "c1d2e3",
            task_name: "任务8-dbrx-天气预报建模任务组",
            status: 3,
            task_group_label: "天气预报建模任务组",
            model_name: "DBRX",
            dataset_name: "天气数据集",
            create_time: "2023-11-08 16:00:00",
            start_time: "2023-11-08 16:10:00",
            end_time: "2023-11-08 16:30:00",
            progress: { completed_count: 30, total_count: 100, duration: "20分钟" }
          },
          // 任务9
          {
            task_id: "f4g5h6",
            task_name: "任务9-phi3-交通流量预测任务组",
            status: 0,
            task_group_label: "交通流量预测任务组",
            model_name: "Phi-3-mini",
            dataset_name: "交通数据集",
            create_time: "2023-11-09 17:00:00",
            start_time: null,
            end_time: null,
            progress: { completed_count: 0, total_count: 0, duration: "0秒" }
          },
          // 任务10
          {
            task_id: "i7j8k9",
            task_name: "任务10-deepseek-健康监测任务组",
            status: 1,
            task_group_label: "健康监测任务组",
            model_name: "DeepSeek-V3",
            dataset_name: "健康数据集",
            create_time: "2023-11-10 18:00:00",
            start_time: "2023-11-10 18:15:00",
            end_time: null,
            progress: { completed_count: 70, total_count: 100, duration: "30分钟" }
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
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" }
          },
          // 任务12
          {
            task_id: "o3p4q5",
            task_name: "任务12-claude3o-新闻内容分析任务组",
            status: 3,
            task_group_label: "新闻内容分析任务组",
            model_name: "Claude 3 Opus",
            dataset_name: "新闻数据集",
            create_time: "2023-11-12 20:00:00",
            start_time: "2023-11-12 20:10:00",
            end_time: "2023-11-12 20:30:00",
            progress: { completed_count: 15, total_count: 100, duration: "20分钟" }
          },
          // 任务13
          {
            task_id: "r6s7t8",
            task_name: "任务13-llama3-体育赛事分析任务组",
            status: 0,
            task_group_label: "体育赛事分析任务组",
            model_name: "Llama 3",
            dataset_name: "体育数据集",
            create_time: "2023-11-13 21:00:00",
            start_time: null,
            end_time: null,
            progress: { completed_count: 0, total_count: 0, duration: "0秒" }
          },
          // 任务14
          {
            task_id: "u9v0w1",
            task_name: "任务14-gemini-娱乐推荐优化任务组",
            status: 1,
            task_group_label: "娱乐推荐优化任务组",
            model_name: "Gemini Pro",
            dataset_name: "娱乐数据集",
            create_time: "2023-11-14 22:00:00",
            start_time: "2023-11-14 22:15:00",
            end_time: null,
            progress: { completed_count: 55, total_count: 100, duration: "40分钟" }
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
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" }
          },
          // 任务16
          {
            task_id: "a5b6c7",
            task_name: "任务16-mistral7b-合同合规审查任务组",
            status: 3,
            task_group_label: "合同合规审查任务组",
            model_name: "Mistral 7B",
            dataset_name: "法律数据集2",
            create_time: "2023-11-16 00:00:00",
            start_time: "2023-11-16 00:10:00",
            end_time: "2023-11-16 00:30:00",
            progress: { completed_count: 10, total_count: 100, duration: "20分钟" }
          },
          // 任务17
          {
            task_id: "d8e9f0",
            task_name: "任务17-commandr-AI图像生成任务组",
            status: 0,
            task_group_label: "AI图像生成任务组",
            model_name: "Command R+",
            dataset_name: "交通数据集",
            create_time: "2023-11-17 01:00:00",
            start_time: null,
            end_time: null,
            progress: { completed_count: 0, total_count: 0, duration: "0秒" }
          },
          // 任务18
          {
            task_id: "g1h2i3",
            task_name: "任务18-dbrx-多语言翻译任务组",
            status: 1,
            task_group_label: "多语言翻译任务组",
            model_name: "DBRX",
            dataset_name: "新闻数据集2",
            create_time: "2023-11-18 02:00:00",
            start_time: "2023-11-18 02:15:00",
            end_time: null,
            progress: { completed_count: 80, total_count: 100, duration: "45分钟" }
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
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" }
          },
          // 任务20
          {
            task_id: "m7n8o9",
            task_name: "任务20-deepseek-客户服务分析任务组",
            status: 3,
            task_group_label: "客户服务分析任务组",
            model_name: "DeepSeek-V3",
            dataset_name: "社交媒体用户行为分析数据集",
            create_time: "2023-11-20 04:00:00",
            start_time: "2023-11-20 04:10:00",
            end_time: "2023-11-20 04:30:00",
            progress: { completed_count: 5, total_count: 100, duration: "20分钟" }
          },
          // 任务21
          {
            task_id: "p0q1r2",
            task_name: "任务21-gpt4o-网络安全分析任务组",
            status: 0,
            task_group_label: "网络安全分析任务组",
            model_name: "GPT-4o",
            dataset_name: "交通数据集",
            create_time: "2023-11-21 05:00:00",
            start_time: null,
            end_time: null,
            progress: { completed_count: 0, total_count: 0, duration: "0秒" }
          },
          // 任务22
          {
            task_id: "s3t4u5",
            task_name: "任务22-claude3o-学术研究支持任务组",
            status: 1,
            task_group_label: "学术研究支持任务组",
            model_name: "Claude 3 Opus",
            dataset_name: "教育数据集",
            create_time: "2023-11-22 06:00:00",
            start_time: "2023-11-22 06:15:00",
            end_time: null,
            progress: { completed_count: 30, total_count: 100, duration: "30分钟" }
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
            progress: { completed_count: 100, total_count: 100, duration: "50分钟" }
          },
          // 任务24
          {
            task_id: "y9z0a1",
            task_name: "任务24-gemini-推荐系统优化任务组",
            status: 3,
            task_group_label: "推荐系统优化任务组",
            model_name: "Gemini Pro",
            dataset_name: "娱乐数据集2",
            create_time: "2023-11-24 08:00:00",
            start_time: "2023-11-24 08:10:00",
            end_time: "2023-11-24 08:30:00",
            progress: { completed_count: 85, total_count: 100, duration: "20分钟" }
          },
          // 任务25
          {
            task_id: "b2c3d4",
            task_name: "任务25-yi34b-聊天机器人训练任务组",
            status: 0,
            task_group_label: "聊天机器人训练任务组",
            model_name: "Yi-34B",
            dataset_name: "社交媒体用户行为分析数据集",
            create_time: "2023-11-25 09:00:00",
            start_time: null,
            end_time: null,
            progress: { completed_count: 0, total_count: 0, duration: "0秒" }
          },
        ],
      },
    };
  },
};