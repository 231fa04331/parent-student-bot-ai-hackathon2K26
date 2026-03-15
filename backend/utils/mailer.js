const nodemailer = require("nodemailer");
const dns = require("dns");
require("dotenv").config();

if (typeof dns.setDefaultResultOrder === "function") {
  const dnsOrder = String(process.env.DNS_RESULT_ORDER || "ipv4first").trim();
  dns.setDefaultResultOrder(dnsOrder);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  family: Number(process.env.SMTP_IP_FAMILY || 4),
  // Fail fast in production deployments when SMTP host is unreachable.
  connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
  greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
  socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 15000),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = transporter;