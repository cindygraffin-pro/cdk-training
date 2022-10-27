import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs'; 
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import path, {join} from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

class CdkTrainingStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const handler = new Function(this, 'training-cindy', {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 512,
      handler: 'hello-world.handler',
      code: Code.fromAsset(join(path.dirname(__filename), '../lambdas'))
    })
  }
}

export {CdkTrainingStack};
