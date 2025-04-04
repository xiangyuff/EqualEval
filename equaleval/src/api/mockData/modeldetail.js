export default {
  getModelDetail: (options) => {
    const { model_id } = JSON.parse(options.body);
    const modelDetails = [
      {
        "model_id": "gpt4o_2024v1",
        "basicData": {
          "model_name": "GPT-4O 2024v1",
          "institution": "OpenAI",
          "is_open_source": false,
          "type": "NLP",
          "version": "2024v1",
          "usage_count": 1200,
          "upload_time": "2024-01-15 14:00:00",
          "description": "GPT-4O 2024v1 是 OpenAI 推出的最新版本 GPT-4 模型，具有更强的语言生成能力和更高的准确性。",
          "files": {
            "weights": "gpt4o_2024v1_weights.bin",
            "config": "gpt4o_2024v1_config.json",
            "vocab": "gpt4o_2024v1_vocab.txt"
          }
        },
        "technical_parameters": {
          "architecture": "Transformer",
          "parameters": "1750 亿",
          "training_data": "包含大量互联网文本数据",
          "training_method": "监督学习和强化学习",
          "input_output": {
            "input": "文本",
            "output": "文本"
          },
          "hardware_requirements": {
            "cpu": "Intel Xeon",
            "gpu": "NVIDIA A100",
            "memory": "32GB",
            "storage": "1TB SSD"
          }
        },
        "evaluation_history": [
          {
            "task_name": "任务1-gpt4o-教育能力测评任务组",
            "create_time": "2024-01-15 10:00:00",
            "dataset_name": "教育数据集A",
            "status": "已完成"
          },
          {
            "task_name": "任务2-gpt4o-代码生成能力测评任务组",
            "create_time": "2024-02-01 12:00:00",
            "dataset_name": "代码数据集B",
            "status": "已完成"
          },
          {
            "task_name": "任务3-gpt4o-对话能力测评任务组",
            "create_time": "2024-02-15 14:00:00",
            "dataset_name": "对话数据集C",
            "status": "待执行"
          }
        ],
        "evaluation_table_label": [
          { "label": "测试任务名称", "prop": "task_name" },
          { "label": "创建时间", "prop": "create_time" },
          { "label": "关联数据集", "prop": "dataset_name" },
          { "label": "任务状态", "prop": "status" }
        ]
      },
      {
        "model_id": "claude3_opus",
        "basicData": {
          "model_name": "Claude 3 Opus",
          "institution": "Anthropic",
          "is_open_source": true,
          "type": "NLP",
          "version": "3 Opus",
          "usage_count": 850,
          "upload_time": "2024-02-20 12:00:00",
          "description": "Claude 3 Opus 是 Anthropic 推出的开源版本 Claude 模型，旨在提供高质量的对话和文本生成能力。",
          "files": {
            "weights": "claude3_opus_weights.bin",
            "config": "claude3_opus_config.json",
            "vocab": "claude3_opus_vocab.txt"
          }
        },
        "technical_parameters": {
          "architecture": "Transformer",
          "parameters": "1500 亿",
          "training_data": "包含多语言文本数据",
          "training_method": "监督学习和强化学习",
          "input_output": {
            "input": "文本",
            "output": "文本"
          },
          "hardware_requirements": {
            "cpu": "Intel Xeon",
            "gpu": "NVIDIA V100",
            "memory": "24GB",
            "storage": "512GB SSD"
          }
        },
        "evaluation_history": [
          {
            "task_name": "任务1-claude3-情感理解测评任务组",
            "create_time": "2024-02-20 10:00:00",
            "dataset_name": "情感数据集D",
            "status": "已完成"
          },
          {
            "task_name": "任务2-claude3-对话能力测评任务组",
            "create_time": "2024-03-01 12:00:00",
            "dataset_name": "对话数据集E",
            "status": "已完成"
          },
          {
            "task_name": "任务3-claude3-代码生成能力测评任务组",
            "create_time": "2024-03-15 14:00:00",
            "dataset_name": "代码数据集F",
            "status": "待执行"
          }
        ],
        "evaluation_table_label": [
          { "label": "测试任务名称", "prop": "task_name" },
          { "label": "创建时间", "prop": "create_time" },
          { "label": "关联数据集", "prop": "dataset_name" },
          { "label": "任务状态", "prop": "status" }
        ]
      }
      // 添加更多模型详情
    ];

    const model = modelDetails.find(m => m.model_id === model_id);
    if (model) {
      return {
        code: 200,
        message: "success",
        data: model
      };
    } else {
      return {
        code: 404,
        message: "Model not found",
        data: null
      };
    }
  }
};