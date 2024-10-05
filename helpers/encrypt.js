const crypto = require("crypto");
// const { AesKey, IV } = require("./url");
const encryptionType = "aes-256-cbc";
const encryptionEncoding = "base64";
const bufferEncryption = "utf-8";

const encryptdata = async (text) => {
  const key = Buffer.from(process.env.AesKey, bufferEncryption);
  const iv = Buffer.from(process.env.IV, bufferEncryption);
  const cipher = crypto.createCipheriv(encryptionType, key, iv);
  let encrypted = cipher.update(text, bufferEncryption, encryptionEncoding);
  encrypted += cipher.final(encryptionEncoding);
  return encrypted;
};
module.exports = {
  encryptdata,
};
