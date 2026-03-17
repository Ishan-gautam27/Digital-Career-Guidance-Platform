import cron from 'node-cron';
import { syncAllData } from './dataSyncService';

let isSyncing = false;

async function runSync() {
  if (isSyncing) {
    console.log('[Scheduler] Sync already in progress, skipping...');
    return;
  }

  isSyncing = true;
  try {
    await syncAllData();
  } catch (error) {
    console.error('[Scheduler] Sync failed:', error instanceof Error ? error.message : error);
  } finally {
    isSyncing = false;
  }
}

export function startScheduler() {
  // Run sync every 24 hours at 2:00 AM
  cron.schedule('0 2 * * *', () => {
    console.log('[Scheduler] Running scheduled daily sync...');
    runSync();
  });

  console.log('[Scheduler] Scheduled daily data sync at 2:00 AM');

  // Run initial sync after a short delay to let the server finish starting
  setTimeout(() => {
    console.log('[Scheduler] Running initial data sync...');
    runSync();
  }, 5000);
}
