import * as AWS from 'aws-sdk';

const kmsClient = new AWS.KMS({region: 'eu-west-1'});

/**
 * Encrypt
 */
async function encryptString(text: string): Promise<string> {

    const paramsEncrypt = {
        KeyId: 'arn:aws:kms:xxxxxxxxxxxxxx',
        Plaintext: new Buffer(text)
    };

    const encryptResult = await kmsClient.encrypt(paramsEncrypt).promise();
    // The encrypted plaintext. When you use the HTTP API or the AWS CLI, the value is Base64-encoded. Otherwise, it is not encoded.
    if (Buffer.isBuffer(encryptResult.CiphertextBlob)) {
        return Buffer.from(encryptResult.CiphertextBlob).toString('base64');
    } else {
        throw new Error('Mayday Mayday');
    }
}

/**
 * Decrypt
 */
async function decryptEncodedstring(encoded: string): Promise<string> {

    const paramsDecrypt: AWS.KMS.DecryptRequest = {
        CiphertextBlob: Buffer.from(encoded, 'base64')
    };

    const decryptResult = await kmsClient.decrypt(paramsDecrypt).promise();
    if (Buffer.isBuffer(decryptResult.Plaintext)) {
        return Buffer.from(decryptResult.Plaintext).toString();
    } else {
        throw new Error('We have a problem');
    }
}

async function testEncryption(){
    const input = 'Welcome1';
    console.log('original:' + input)
    const encryptedstring = await encryptString(input);
    console.log('encryptedstring:' + encryptedstring);
    const decryptedstring = await decryptEncodedstring(encryptedstring);
    console.log('decryptedstring:' + decryptedstring);
}

/*
    Execute through ts-node
      node_modules/.bin/ts-node src/util-encryption.ts
 */

testEncryption()
    .then(res => console.log(res))
    .catch(err => console.error(err));


