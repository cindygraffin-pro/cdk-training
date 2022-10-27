import {App} from 'aws-cdk-lib';
import { CdkTrainingStack } from '../lib/cdk-training-stack.js'

const app = new App();
new CdkTrainingStack(app, 'CdkTrainingStack', {});
