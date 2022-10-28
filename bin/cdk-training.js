import {App} from 'aws-cdk-lib';
import { TrainingCindyStack } from '../lib/cdk-training-stack.js';

const app = new App();
new TrainingCindyStack(app, 'training-cindy', {});
