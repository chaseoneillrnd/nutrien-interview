import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

class HistogramApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const histogramLambda = new lambda.Function(this, 'HistogramLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/lambda.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..'), {
        exclude: [
          '.git',
          'node_modules',
          'cdk',
          'cdk.out',
          '.serverless',
          'README.md',
          '.gitignore'
        ]
      }),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        NODE_ENV: 'production'
      }
    });

    const api = new apigateway.RestApi(this, 'HistogramApi', {
      restApiName: 'Histogram API',
      description: 'API for generating histograms from CSV data',
      deployOptions: {
        stageName: 'prod',
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    // Set the API Gateway timeout to match the Lambda function timeout (30 seconds)
    const lambdaIntegration = new apigateway.LambdaIntegration(histogramLambda, {
      proxy: true,
      timeout: cdk.Duration.seconds(30)
    });

    const rootResource = api.root;
    rootResource.addMethod('ANY', lambdaIntegration);

    const proxyResource = rootResource.addResource('{proxy+}');
    proxyResource.addMethod('ANY', lambdaIntegration);

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'URL of the API Gateway endpoint'
    });
  }
}

const app = new cdk.App();
new HistogramApiStack(app, 'HistogramApiStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  }
});
