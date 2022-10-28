import { Stack } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import path, {join} from 'path';
import {fileURLToPath} from 'url';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

const __filename = fileURLToPath(import.meta.url);

class TrainingCindyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const sayHelloWorld = new Function(this, 'hello-world', {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 512,
      handler: 'hello-world.handler',
      code: Code.fromAsset(join(path.dirname(__filename), '../lambdas'))
    });

    const api = new RestApi(this, 'training-api');

    const mainPath = api.root.addResource('hello');

    mainPath.addMethod('GET', new LambdaIntegration(sayHelloWorld));
  }
}

export {TrainingCindyStack};
