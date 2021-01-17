const RealtimeIOEncoder = require("./RealtimeIOEncoder");
const crypto = require("crypto");

class RealtimeIOAesEncoder extends RealtimeIOEncoder {
  constructor(key, iv, algorithm = "aes-256-cbc") {
    super();
    this.algorithm = algorithm;
    this.key = key;
    this.iv = iv;
  }
  encode(rawMessage) {
    try {
      const _iv = Buffer.from(this.iv, "utf-8");
      const _key = Buffer.from(this.key, "utf-8");
      rawMessage = Buffer.from(rawMessage, "utf-8");
      let cipher = crypto.createCipheriv(this.algorithm, _key, _iv);
      let encrypted = cipher.update(rawMessage);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return encrypted.toString("hex");
    } catch {
      return "";
    }
  }
  decode(rawMessage) {
    try {
      const _iv = Buffer.from(this.iv, "utf-8");
      const _key = Buffer.from(this.key, "utf-8");

      let encryptedText = Buffer.from(rawMessage, "hex");
      let decipher = crypto.createDecipheriv(this.algorithm, _key, _iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch {
      return "";
    }
  }
}
module.exports = RealtimeIOAesEncoder;
