import { PrismaClient } from '@prisma/client';

// Global declaration for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient
export const db = globalThis.__db || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.__db = db;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect();
});

// Database health check
export async function healthCheck(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Connection helper with retry logic
export async function connectWithRetry(maxRetries: number = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await db.$connect();
      console.log('Database connected successfully');
      return true;
    } catch (error) {
      console.error(`Database connection attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
}

// Database metrics
export async function getDatabaseMetrics() {
  try {
    const [userCount, dreamCount, visionBoardCount, sessionCount] = await Promise.all([
      db.user.count(),
      db.dream.count(),
      db.visionBoard.count(),
      db.coachingSession.count(),
    ]);

    return {
      users: userCount,
      dreams: dreamCount,
      visionBoards: visionBoardCount,
      coachingSessions: sessionCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching database metrics:', error);
    throw error;
  }
}

// Transaction helper
export async function withTransaction<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await db.$transaction(async (tx) => {
    return await fn(tx);
  });
}

export default db;