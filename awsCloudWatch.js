// src/awsCloudWatch.js
import AWS from 'aws-sdk';

// Configure the AWS SDK with credentials
AWS.config.update({
  region: 'ap-southeat-2', // e.g., 'us-west-2'
  accessKeyId: 'AKIAVYV5ZWPRNMXDPJSO',
  secretAccessKey: '',
});

const cloudwatch = new AWS.CloudWatch();

// Function to get ECS instance downtime
export const getEcsDowntime = async (ecsClusterName, ecsServiceName) => {
  const params = {
    StartTime: new Date(new Date().setDate(new Date().getDate() - 1)), // 1 day ago
    EndTime: new Date(),
    MetricName: '', //  metric
    Namespace: 'AWS/ECS',
    Period: 300,
    Statistics: ['Average'],
    Dimensions: [
      {
        Name: 'ClusterName',
        Value: ecsClusterName,
      },
      {
        Name: 'ServiceName',
        Value: ecsServiceName,
      },
    ],
  };

  try {
    const data = await cloudwatch.getMetricStatistics(params).promise();
    // Here, you can process the data to extract downtime information
    return data;
  } catch (error) {
    console.error('Error fetching ECS downtime:', error);
    return null;
  }
};
