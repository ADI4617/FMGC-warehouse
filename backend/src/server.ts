import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { initializeDatabase } from './config/database.js';
import { seedDatabase } from './config/seed.js';

async function bootstrap() {
  try {
    // 1. Initialize SQLite Database Schema
    initializeDatabase();

    // 2. Seed Initial Demo Data (INR ₹)
    await seedDatabase();

    // 3. Start Express Server
    app.listen(env.PORT, () => {
      logger.info(`FMCG Distro Production Backend running on http://localhost:${env.PORT}`);
      logger.info(`Health check available at http://localhost:${env.PORT}/api/v1/health`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: String(error) });
    process.exit(1);
  }
}

bootstrap();
