#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LearningAwsCdkStack } from '../lib/learning-aws-cdk-stack';

const app = new cdk.App();
new LearningAwsCdkStack(app, 'LearningAwsCdkStack', {
  env: { account: '173532292739', region: 'us-east-1' },
});
