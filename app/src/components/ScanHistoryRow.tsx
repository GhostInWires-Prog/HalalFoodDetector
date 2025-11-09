import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScanRecord } from '../services/halalGuidanceService';
import { colors } from '../theme/colors';
import { StatusPill } from './StatusPill';

type ScanHistoryRowProps = {
  item: ScanRecord;
};

export const ScanHistoryRow = memo(function ScanHistoryRow({ item }: ScanHistoryRowProps) {
  const formattedDate = useMemo(() => item.scannedAt, [item.scannedAt]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.product}>{item.productName}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
        </View>
        <StatusPill status={item.status} />
      </View>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.summary}>{item.summary}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerCopy: {
    flex: 1,
    paddingRight: 16,
  },
  product: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  brand: {
    marginTop: 6,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  summary: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});


