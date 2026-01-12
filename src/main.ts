import { sdk } from './tracing';
import { ShutdownSignal } from '@nestjs/common';

async function bootstrap() {
  sdk.start();
  console.log('OpenTelemetry initialized');

  const { NestFactory } = await import('@nestjs/core');
  const { AppModule } = await import('./app.module.js');
  const { WinstonModule } = await import('nest-winston');
  const { winstonConfig } = await import('./logger/winston.config.js');
  const { ValidationPipe } = await import('@nestjs/common');

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  app.enableShutdownHooks([ShutdownSignal.SIGTERM], { useProcessExit: true });
  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error));
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
void bootstrap();
