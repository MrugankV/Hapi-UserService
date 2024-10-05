const crypto = require("crypto");
// const { AesKey } = require("./url");
const encryptionType = "aes-256-cbc";
const encryptionEncoding = "base64";
const bufferEncryption = "utf-8";
const AesIV = new Buffer.alloc(8).toString("hex");
const decryptdata = async (text) => {
  const buff = Buffer.from(text, encryptionEncoding);
  const key = Buffer.from(process.env.AesKey, bufferEncryption);
  const iv = Buffer.from(process.env.IV, bufferEncryption);
  const decipher = crypto.createDecipheriv(encryptionType, key, iv);
  const deciphered = decipher.update(buff) + decipher.final();
  return deciphered;
};
module.exports = {
  decryptdata,
};
