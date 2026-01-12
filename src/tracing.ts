import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import * as process from 'process';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
// import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';

// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceExporter = new OTLPTraceExporter({
  url:
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
    'http://localhost:4318/v1/traces',
});

// 2. Config Metrics (MỚI)
// Exporter này sẽ tự động mở port 9464 (default) hoặc port bạn chọn để Prometheus scrape
const metricReader = new PrometheusExporter({
  port: 9464, // Port riêng cho metrics
  endpoint: '/metrics',
});

export const sdk = new NodeSDK({
  traceExporter,
  metricReaders: [metricReader], // <--- Gắn metric reader vào SDK
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
});
