/**
 * this is melongs to the manifest.json and with this code it is not working and also with this code we can fix openpgp.mi,n.js problem
 *  "content_security_policy": {
        "extension_pages": "script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net"
    }
 */



document.addEventListener('DOMContentLoaded', function() {
    // DOM tamamen yüklendiğinde çalışacak kodlar buraya gelecek
    // Örneğin, butona tıklama olayı burada eklenebilir
    document.getElementById('myButton').addEventListener('click', function() {
        console.log('Hello, world!');
    });
});


document.getElementById('generateKeys').addEventListener('click', generateKeys);
document.getElementById('encryptMessage').addEventListener('click', encryptMessage);
document.getElementById('signMessage').addEventListener('click', signMessage);
document.getElementById('decryptMessage').addEventListener('click', decryptMessage);
document.getElementById('verifySignature').addEventListener('click', verifySignature);

async function generateKeys() {
    // fonk. içerisine giriyor ama promise error veriyor.
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }],
  });
  console.log('Private Key:', privateKey);
  console.log('Public Key:', publicKey);
}

async function encryptMessage() {
  const publicKeyArmored = document.getElementById('publicKey').value;
  const message = document.getElementById('message').value;
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }),
    encryptionKeys: publicKey,
  });
  console.log('Encrypted Message:', encrypted);
}

async function signMessage() {
  const privateKeyArmored = document.getElementById('privateKey').value;
  const message = document.getElementById('message').value;
  const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
  const signed = await openpgp.sign({
    message: await openpgp.createMessage({ text: message }),
    signingKeys: privateKey,
  });
  console.log('Signed Message:', signed);
}

async function decryptMessage() {
  const privateKeyArmored = document.getElementById('privateKey').value;
  const encryptedMessage = document.getElementById('encryptedMessage').value;
  const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
  const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });
  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });
  console.log('Decrypted Message:', decrypted);
}

async function verifySignature() {
  const publicKeyArmored = document.getElementById('publicKey').value;
  const signedMessage = document.getElementById('signedMessage').value;
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const message = await openpgp.readMessage({ armoredMessage: signedMessage });
  const verificationResult = await openpgp.verify({
    message,
    verificationKeys: publicKey,
  });
  const { verified } = verificationResult.signatures[0];
  try {
    await verified; // throws on invalid signature
    console.log('Signature is valid');
  } catch (e) {
    console.error('Signature is invalid');
  }
}
