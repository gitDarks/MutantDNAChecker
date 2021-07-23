import AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { expect } from 'chai';
import sinon from 'sinon';
import * as configService from '../src/config';

describe('Config', () => {
    beforeEach(() => {
        //process.env.NODE_ENV = 'stage';
        AWSMock.setSDKInstance(AWS);
    });

    it('should return true on getVariable', async () => {
        const response = await configService.config();
        expect(response).to.be.true;
        process.env.NODE_ENV = '';
        await configService.config();
    });
});
