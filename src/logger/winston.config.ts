import { ElasticsearchTransport } from 'winston-elasticsearch';
import * as winston from 'winston';

export const winstonConfig = {
  transports: [
    // 1. Log ra Console (để dev nhìn)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // 2. Log vào Elastic (để Grafana đọc)
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: {
        node: process.env.ELASTIC_NODE || 'http://localhost:9200',
        // Nếu có user/pass thì thêm auth vào đây
      },
      indexPrefix: 'nest-logs', // Log sẽ lưu vào index tên: nest-logs-YYYY.MM.DD
      transformer: (logData) => {
        return {
          '@timestamp': new Date(),
          severity: logData.level,
          message: String(logData.message),
          fields: logData.meta, // Metadata kèm theo
        };
      },
    }),
  ],
};
