import { Duration, Stack } from 'aws-cdk-lib';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import path, {join} from 'path';
import {fileURLToPath} from 'url';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

const __filename = fileURLToPath(import.meta.url);

class TrainingCindyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const sayHelloWorld = new Function(this, 'hello-world', {
      runtime: Runtime.NODEJS_16_X,
      handler: 'hello-world.handler',
      code: Code.fromAsset(join(path.dirname(__filename), '../lambdas'))
    });

    const api = new RestApi(this, 'training-api');

    const mainPath = api.root.addResource('hello');

    mainPath.addMethod('GET', new LambdaIntegration(sayHelloWorld));

    const fifoQueue = new Queue(this, 'fifo-queue.fifo', {
      queueName: 'fifo-processing-queue.fifo',
      fifo: true,
      contentBasedDeduplication: true
    });

    const sqsLambdaEventSource = new SqsEventSource(fifoQueue, {
      batchSize: 10,
      enabled: true
    });

    const createInquiryFunction = new Function(this, 'CreateInquiryLambda', {
      code: Code.fromAsset(join(path.dirname(__filename), '../lambdas')),
      runtime: Runtime.NODEJS_16_X,
      handler: 'plus-one.createInquiry',
      timeout: Duration.seconds(10),
      memorySize: 256,
      environment: {
        INQUIRY_PROCESSING_QUEUE_URL: fifoQueue.queueUrl,
      }
    });

    fifoQueue.grantSendMessages(createInquiryFunction);


    const processInquiryFunction = new Function(this, 'ProcessInquiryLambda', {
      code: Code.fromAsset(join(path.dirname(__filename), '../lambdas')),
      runtime: Runtime.NODEJS_16_X,
      handler: 'plus-one.processInquiry'
    });

    processInquiryFunction.addEventSource(sqsLambdaEventSource);
  }
}

export {TrainingCindyStack};
