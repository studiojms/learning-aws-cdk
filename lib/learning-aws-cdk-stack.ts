import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { Alarm } from '@aws-cdk/aws-cloudwatch';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';
import { SlackNotificationAction } from '@junglescout/geoglyphs';
import * as path from 'path';

export class LearningAwsCdkStack extends cdk.Stack {
  urlOutput: cdk.CfnOutput;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new Function(this, 'lambda function', {
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.resolve(__dirname, 'lambda')),
    });

    const alarmAction = new SlackNotificationAction(this, {
      webhookUrl: 'https://hooks.slack.com/services/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',
    });

    const alarm = new Alarm(this, 'alarm', {
      metric: handler.metricErrors(),
      threshold: 1,
      datapointsToAlarm: 1,
      evaluationPeriods: 1,
    });

    alarm.addAlarmAction(alarmAction);

    const gateway = new LambdaRestApi(this, 'gateway', {
      description: 'endpoint for simple lambda service',
      handler,
    });

    this.urlOutput = new CfnOutput(this, 'url', {
      value: gateway.url,
    });
  }
}
