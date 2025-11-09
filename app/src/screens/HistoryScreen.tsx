import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { ScanHistoryRow } from '../components/ScanHistoryRow';
import { StatusPill } from '../components/StatusPill';
import { useHalalInsights } from '../hooks/useHalalInsights';
import { colors } from '../theme/colors';

export function HistoryScreen() {
  const { history } = useHalalInsights();

  const metrics = useMemo(() => {
    const grouped = history.reduce<Record<string, number>>((acc, record) => {
      acc[record.status] = (acc[record.status] ?? 0) + 1;
      return acc;
    }, {});

    return [
      { id: 'halal', label: 'Halal', value: grouped.Halal ?? 0 },
      { id: 'haram', label: 'Haram', value: grouped.Haram ?? 0 },
      { id: 'doubtful', label: 'Doubtful', value: grouped.Doubtful ?? 0 },
    ];
  }, [history]);

  return (
    <ScreenContainer>
      <LinearGradient
        colors={[colors.surfaceAlt, colors.surface, colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.overline}>Activity Log</Text>
        <Text style={styles.heroTitle}>Every scan, organised for audit</Text>
        <Text style={styles.heroSubtitle}>
          Track halal decisions, note escalations, and keep reviewers aligned using the unified timeline.
        </Text>
      </LinearGradient>

      <SectionHeader title="Scan history" subtitle="Your latest verifications and ingredient reviews" />

      <View style={styles.metricsRow}>
        {metrics.map((metric) => (
          <View key={metric.id} style={styles.metricCell}>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <FlashList
        data={history}
        estimatedItemSize={120}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ScanHistoryRow item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <StatusPill status="Halal" />
            <Text style={styles.emptyText}>
              Your scan history is empty. Start scanning to build your halal profile.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 26,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  overline: {
    color: colors.accentSoft,
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  heroSubtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  metricsRow: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  metricCell: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricLabel: {
    marginTop: 6,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});


