const AWS = require('aws-sdk')
const sqs = new AWS.SQS({ region: 'eu-west-3' });

exports.createInquiry = async (event) => {
    const INQUIRY_PROCESSING_QUEUE_URL = process.env.INQUIRY_PROCESSING_QUEUE_URL;
    
    const number = event.number
    console.log('NUMBER: ', number);

    const messageId = await sqs
        .sendMessage({
            QueueUrl: INQUIRY_PROCESSING_QUEUE_URL,
            MessageBody: JSON.stringify(number),
            MessageGroupId: 'fifo'
        })
        .promise();

    console.log(`Message ${messageId} and ${number} sent to queue`);

    return {
        statusCode: 200,
        body: JSON.stringify(number)
    };
}

exports.processInquiry = async(event) => {
    const number = event.Records[0].body;
    const numberPlusOne = +number + 1;
    console.log(numberPlusOne);
    console.log(typeof numberPlusOne);
    return numberPlusOne;
}