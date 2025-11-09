import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { ChatBubble } from '../components/ChatBubble';
import { InsightCard } from '../components/InsightCard';
import { QuickActionButton } from '../components/QuickActionButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { StatusPill } from '../components/StatusPill';
import { loog } from '../lib/loogin';
import { useHalalInsights } from '../hooks/useHalalInsights';
import { colors } from '../theme/colors';

export function HomeScreen() {
  const { snapshot, safeRatio } = useHalalInsights();

  const progressStyle = useMemo<ViewStyle>(
    () => ({
      width: `${Math.min(Math.max(safeRatio, 0), 100)}%`,
    }),
    [safeRatio],
  );

  const handleScanBarcode = useCallback(() => {
    loog.info('Navigate to barcode scanner');
  }, []);

  const handleAnalyzeImage = useCallback(() => {
    loog.info('Navigate to halal logo analyzer');
  }, []);

  const handleOpenChat = useCallback(() => {
    loog.info('Open chat assistant from dashboard quick action');
  }, []);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.surfaceAlt, colors.surface, colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.overline}>Halal Identifier</Text>
          <Text style={styles.heroTitle}>Assalamualaikum, ready to verify?</Text>
          <Text style={styles.heroSubtitle}>
            Monitor your halal posture, triage doubtful ingredients, and keep your favourites compliant across regions.
          </Text>

          <View style={styles.heroMetrics}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{safeRatio}%</Text>
              <Text style={styles.metricLabel}>Portfolio halal</Text>
            </View>
            <View style={styles.metricDetail}>
              <Text style={styles.metricHeadline}>Daily halal insights</Text>
              <Text style={styles.metricDescription}>
                {snapshot.pendingReviews} product{snapshot.pendingReviews === 1 ? '' : 's'} awaiting manual review today.
              </Text>
            </View>
          </View>
        </LinearGradient>

        {snapshot.lastScan ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardLabel}>Last Scan</Text>
                <Text style={styles.cardTitle}>{snapshot.lastScan.productName}</Text>
                <Text style={styles.cardSubtitle}>{snapshot.lastScan.brand}</Text>
              </View>
              <StatusPill status={snapshot.lastScan.status} />
            </View>
            <Text style={styles.cardBody}>{snapshot.lastScan.summary}</Text>
            <Text style={styles.cardMeta}>{snapshot.lastScan.scannedAt}</Text>
          </View>
        ) : null}

        <SectionHeader title="Quick Actions" subtitle="Choose how you would like to identify a product today" />
        <View style={styles.quickActions}>
          <View style={styles.quickActionCell}>
            <QuickActionButton icon="barcode" label="Scan Barcode" onPress={handleScanBarcode} />
          </View>
          <View style={styles.quickActionCellEnd}>
            <QuickActionButton icon="camera" label="Analyze Image" onPress={handleAnalyzeImage} tone="secondary" />
          </View>
        </View>

        <SectionHeader
          title="Safety Snapshot"
          subtitle="Verified vs flagged products based on your latest scans"
          action={
            <View style={styles.snapshotBadge}>
              <Text style={styles.snapshotBadgeText}>{safeRatio}% halal</Text>
            </View>
          }
        />

        <View style={styles.snapshotCard}>
          <View style={styles.snapshotCounts}>
            <View style={styles.snapshotCount}>
              <Text style={styles.snapshotCountValue}>{snapshot.verifiedCount}</Text>
              <Text style={styles.snapshotCountLabel}>Verified items</Text>
            </View>
            <View style={styles.snapshotCount}>
              <Text style={[styles.snapshotCountValue, styles.snapshotCountDanger]}>{snapshot.flaggedCount}</Text>
              <Text style={styles.snapshotCountLabel}>Flagged items</Text>
            </View>
            <View style={styles.snapshotCount}>
              <Text style={[styles.snapshotCountValue, styles.snapshotCountWarning]}>{snapshot.pendingReviews}</Text>
              <Text style={styles.snapshotCountLabel}>Pending reviews</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, progressStyle]} />
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Quick tips</Text>
            {snapshot.quickTips.map((tip) => (
              <Text key={tip} style={styles.tipItem}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>

        <SectionHeader title="Insights" subtitle="Smart highlights to help you decide faster" />
        <View style={styles.insightsGrid}>
          {snapshot.insights.map((insight, index) => (
            <View key={insight.id} style={index > 0 ? styles.insightItemSpacing : undefined}>
              <InsightCard
                icon={insight.icon as any}
                title={insight.title}
                description={insight.description}
              />
            </View>
          ))}
        </View>

        <SectionHeader
          title="Chat With Noor"
          subtitle="Your halal compliance assistant is available 24/7"
          action={
            <QuickActionButton
              icon="sparkles"
              label="Ask now"
              onPress={handleOpenChat}
              tone="secondary"
              fullWidth={false}
            />
          }
        />
        <View style={styles.chatPreview}>
          <View>
            <ChatBubble
              author="assistant"
              content="Salam! Want me to double-check that barcode or explain an ingredient today?"
              timestamp="Today • 09:30 AM"
            />
            <View style={styles.chatPreviewSpacing}>
              <ChatBubble
                author="user"
                content="Summarise doubtful additives for the snack aisle."
                timestamp="Today • 09:31 AM"
              />
            </View>
            <View style={styles.chatPreviewSpacing}>
              <ChatBubble
                author="assistant"
                content="On it! E441 gelatine, E433 polysorbate, and artificial wine vinegar extracts need manual verification."
                timestamp="Today • 09:31 AM"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 96,
    backgroundColor: colors.background,
  },
  heroCard: {
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginBottom: 28,
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
    color: colors.textSubtle,
    maxWidth: '92%',
  },
  heroMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  metricCard: {
    marginRight: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accentSoft,
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(190, 242, 100, 0.9)',
  },
  metricDetail: {
    flex: 1,
  },
  metricHeadline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metricDescription: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSubtle,
  },
  card: {
    marginBottom: 28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 24,
  },
  cardHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderText: {
    flex: 1,
    paddingRight: 16,
  },
  cardLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  cardTitle: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  cardMeta: {
    marginTop: 16,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  snapshotBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  snapshotBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accentSoft,
  },
  snapshotCard: {
    marginBottom: 32,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 24,
  },
  snapshotCounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  snapshotCount: {
    alignItems: 'center',
  },
  snapshotCountValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  snapshotCountLabel: {
    marginTop: 6,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  snapshotCountDanger: {
    color: colors.danger,
  },
  snapshotCountWarning: {
    color: colors.warning,
  },
  progressTrack: {
    height: 8,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  tipCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#03091c',
    padding: 18,
  },
  tipTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  tipItem: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  insightsGrid: {
    marginBottom: 32,
  },
  insightItemSpacing: {
    marginTop: 16,
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  quickActionCell: {
    flex: 1,
    marginRight: 12,
  },
  quickActionCellEnd: {
    flex: 1,
  },
  chatPreview: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 24,
  },
  chatPreviewSpacing: {
    marginTop: 16,
  },
});


