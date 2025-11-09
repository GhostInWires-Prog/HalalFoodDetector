import { useMemo } from 'react';

import { halalGuidanceService } from '../services/halalGuidanceService';

export function useHalalInsights() {
  const snapshot = useMemo(() => halalGuidanceService.getDashboardSnapshot(), []);
  const history = useMemo(() => halalGuidanceService.getScanHistory(), []);

  const safeRatio = useMemo(() => {
    const total = snapshot.verifiedCount + snapshot.flaggedCount;
    if (total === 0) {
      return 0;
    }
    return Math.round((snapshot.verifiedCount / total) * 100);
  }, [snapshot.flaggedCount, snapshot.verifiedCount]);

  return {
    snapshot,
    history,
    safeRatio,
  };
}


