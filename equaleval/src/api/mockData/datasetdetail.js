export default {
  getDatasetDetail: (options) => {
    const { dataset_id } = JSON.parse(options.body);
    const datasetDetails = [
      {
        "dataset_id": "m1n2o3p4q5r6",
        "basicData": {
          "dataset_name": "高级编程语言数据集",
          "labels": ["编程", "算法"],
          "size": "320MB",
          "type": "CSV",
          "usage_count": 4,
          "upload_time": "2023-10-21 10:00:00",
          "description": "包含多种编程语言的代码示例和算法实现",
          "source": "开源社区",
          "license": "Apache 2.0"
        },
        "previewTabledata": [
          { "code": "print('Hello, World!')", "language": "Python" },
          { "code": "console.log('Hello, World!')", "language": "JavaScript" },
          { "code": "System.out.println('Hello, World!')", "language": "Java" },
          { "code": "echo 'Hello, World!';", "language": "PHP" },
          { "code": "puts 'Hello, World!'", "language": "Ruby" },
          { "code": "console.write('Hello, World!')", "language": "Go" },
          { "code": "std::cout << 'Hello, World!' << std::endl;", "language": "C++" },
          { "code": "fmt.Println('Hello, World!')", "language": "Go" },
          { "code": "println('Hello, World!')", "language": "Kotlin" },
          { "code": "System.debug('Hello, World!')", "language": "Apex" }
        ],
        "previewTableLabel": [
          { "label": "代码示例", "prop": "code" },
          { "label": "编程语言", "prop": "language" }
        ]
      },
      {
        "dataset_id": "s7t8u9v0w1x2",
        "basicData": {
          "dataset_name": "全球气候变化数据集",
          "labels": ["环境", "气候变化", "气象"],
          "size": "330MB",
          "type": "JSON",
          "usage_count": 6,
          "upload_time": "2023-10-22 11:00:00",
          "description": "全球各地的气候变化数据，包括温度、湿度、降水量等",
          "source": "气象局",
          "license": "CC BY-SA 4.0"
        },
        "previewTabledata": [
          { "location": "北京", "temperature": "22°C", "humidity": "50%", "precipitation": "0mm" },
          { "location": "上海", "temperature": "24°C", "humidity": "60%", "precipitation": "5mm" },
          { "location": "广州", "temperature": "28°C", "humidity": "70%", "precipitation": "10mm" },
          { "location": "深圳", "temperature": "26°C", "humidity": "65%", "precipitation": "8mm" },
          { "location": "成都", "temperature": "20°C", "humidity": "55%", "precipitation": "3mm" },
          { "location": "杭州", "temperature": "23°C", "humidity": "60%", "precipitation": "6mm" },
          { "location": "西安", "temperature": "19°C", "humidity": "50%", "precipitation": "2mm" },
          { "location": "武汉", "temperature": "21°C", "humidity": "58%", "precipitation": "4mm" },
          { "location": "南京", "temperature": "22°C", "humidity": "57%", "precipitation": "5mm" },
          { "location": "重庆", "temperature": "25°C", "humidity": "75%", "precipitation": "12mm" }
        ],
        "previewTableLabel": [
          { "label": "地点", "prop": "location" },
          { "label": "温度", "prop": "temperature" },
          { "label": "湿度", "prop": "humidity" },
          { "label": "降水量", "prop": "precipitation" }
        ]
      },
      // 添加更多数据集详情
    ];

    const dataset = datasetDetails.find(d => d.dataset_id === dataset_id);
    if (dataset) {
      return {
        code: 200,
        message: "success",
        data: dataset
      };
    } else {
      return {
        code: 404,
        message: "Dataset not found",
        data: null
      };
    }
  }
};