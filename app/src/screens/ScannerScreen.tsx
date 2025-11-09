import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { QuickActionButton } from '../components/QuickActionButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { StatusPill } from '../components/StatusPill';
import { loog } from '../lib/loogin';
import {
  classifyProduct,
  type ProductClassificationResponse,
  type FeatureBreakdown,
} from '../services/productService';
import { colors } from '../theme/colors';

const scanModes = [
  { id: 'barcode', label: 'Barcode', description: 'Use the device camera to read product UPC/EAN codes.' },
  { id: 'logo', label: 'Halal Logo', description: 'Detect halal certification marks on packaging.' },
  {
    id: 'ingredients',
    label: 'Ingredient OCR',
    description: 'Capture ingredient lists and flag doubtful additives instantly.',
  },
] as const;

export function ScannerScreen() {
  const [activeMode, setActiveMode] = useState<(typeof scanModes)[number]['id']>('ingredients');
  const [classificationResult, setClassificationResult] = useState<ProductClassificationResponse | null>(null);
  const [classificationError, setClassificationError] = useState<string | null>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);

  const featureBreakdown: FeatureBreakdown | null = classificationResult?.feature_breakdown ?? null;
  const ingredientInsight = featureBreakdown?.ingredients ?? null;
  const barcodeInsight = featureBreakdown?.barcode ?? null;
  const logoInsight = featureBreakdown?.logo ?? null;

  const { mutateAsync: runClassification, isPending: isClassifying } = useMutation<
    ProductClassificationResponse,
    Error,
    Parameters<typeof classifyProduct>[0]
  >({
    mutationFn: classifyProduct,
    onSuccess: (data) => {
      setClassificationResult(data);
      setClassificationError(null);
      loog.info('Halal classification received', { status: data.halal_status, confidence: data.confidence });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Unable to classify product right now. Please try again.';
      setClassificationError(message);
      setClassificationResult(null);
      loog.error('Halal classification failed', { message });
    },
  });

  const handleModeChange = useCallback(
    (modeId: (typeof scanModes)[number]['id']) => {
      setActiveMode(modeId);
      setClassificationResult(null);
      setClassificationError(null);
      setCapturedImageUri(null);
      loog.info('Scanner mode switched', { modeId });
    },
    [],
  );

  const activeDescription = useMemo(
    () => scanModes.find((mode) => mode.id === activeMode)?.description ?? '',
    [activeMode],
  );

  const captureSteps = useMemo(
    () => [
      'Hold the product steady with the code centred inside the frame.',
      'Ensure lighting is even. Avoid reflections or glare on glossy packaging.',
      'Allow the app to auto-focus before tapping capture for sharper OCR results.',
    ],
    [],
  );

  const handleStartScan = useCallback(async () => {
    loog.info('Start scanning workflow triggered', { activeMode });
    setClassificationError(null);
    setClassificationResult(null);

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        const message = 'Camera access is required to scan product labels.';
        loog.warn(message, { status });
        setClassificationError(message);
        return;
      }

      const capture = await ImagePicker.launchCameraAsync({
        base64: true,
        quality: 0.7,
        allowsEditing: false,
        exif: false,
      });

      if (capture.canceled || !capture.assets?.length) {
        loog.info('Scanning cancelled by user');
        return;
      }

      const asset = capture.assets[0];
      setCapturedImageUri(asset.uri ?? null);

      try {
        await runClassification({
          productName: undefined,
          captureMode: activeMode,
          imageBase64: asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : undefined,
        });
      } catch (mutationError) {
        const message =
          mutationError instanceof Error
            ? mutationError.message
            : 'Unable to classify product right now. Please try again.';
        loog.error('Halal classification request failed', { message });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error while capturing image. Please try again.';
      loog.error('Scanning workflow failed', { message });
      setClassificationError(message);
    }
  }, [activeMode, runClassification]);

  const handleOpenGuidelines = useCallback(() => {
    loog.info('Open scanning guidelines');
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
          <Text style={styles.overline}>Scanner Suite</Text>
          <Text style={styles.heroTitle}>Choose how you capture evidence</Text>
          <Text style={styles.heroSubtitle}>
            Toggle between barcode, halal logo, and OCR capture to validate packaging in seconds.
          </Text>
        </LinearGradient>

        <SectionHeader title="Smart Scanner" subtitle="Select your preferred capture mode to begin" />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Active mode</Text>
          <Text style={styles.summaryValue}>
            {scanModes.find((mode) => mode.id === activeMode)?.label}
          </Text>
          <Text style={styles.summaryDescription}>{activeDescription}</Text>
        </View>

        <SectionHeader title="Capture Modes" subtitle="Switch depending on the product you are verifying" />
        <View style={styles.modeList}>
          {scanModes.map((mode, index) => {
            const isActive = mode.id === activeMode;
            return (
              <Pressable
                key={mode.id}
                style={[
                  styles.modeCard,
                  index > 0 ? styles.modeSpacing : null,
                  isActive ? styles.modeCardActive : styles.modeCardInactive,
                ]}
                onPress={() => handleModeChange(mode.id)}
              >
                <View style={styles.modeRow}>
                  <View style={styles.modeCopy}>
                    <Text style={styles.modeTitle}>{mode.label}</Text>
                    <Text style={styles.modeDescription}>{mode.description}</Text>
                  </View>
                  <View style={[styles.modeIndicator, isActive ? styles.modeIndicatorActive : styles.modeIndicatorIdle]}>
                    <Text style={[styles.modeIndicatorText, isActive ? styles.modeIndicatorTextActive : undefined]}>
                      {isActive ? 'On' : 'Off'}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <SectionHeader title="How to capture" subtitle="Best practices for clean and reliable scans" />
        <View style={styles.tipCard}>
          {captureSteps.map((step, index) => (
            <View key={step} style={[styles.tipRow, index === 0 ? null : styles.tipRowSpacing]}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionRow}>
          <View style={styles.actionSpacing}>
            <QuickActionButton icon="scan" label="Start scanning" onPress={handleStartScan} />
          </View>
          <View style={styles.actionSpacingEnd}>
            <QuickActionButton icon="book" label="Guidelines" onPress={handleOpenGuidelines} tone="secondary" />
          </View>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Live model output</Text>
          <Text style={styles.resultSubtitle}>
            {classificationResult?.recognized_ingredients_text
              ? 'Extracted ingredient text'
              : 'Awaiting ingredient capture'}
          </Text>
          {classificationResult?.recognized_ingredients_text ? (
            <Text style={styles.resultIngredients}>
              {classificationResult.recognized_ingredients_text}
            </Text>
          ) : (
            <Text style={styles.resultHint}>Tap “Start scanning” to capture ingredients from the product label.</Text>
          )}
          {capturedImageUri ? (
            <Image source={{ uri: capturedImageUri }} style={styles.previewImage} />
          ) : null}
          {isClassifying ? (
            <Text style={styles.resultStatus}>Running halal analysis…</Text>
          ) : classificationError ? (
            <Text style={styles.resultError}>{classificationError}</Text>
          ) : classificationResult ? (
            <View>
              <View style={styles.resultStatusRow}>
                <StatusPill status={classificationResult.halal_status} />
                <Text style={styles.resultStatus}>
                  {(classificationResult.confidence * 100).toFixed(1)}% confidence
                </Text>
              </View>
              <View style={styles.resultEvidenceList}>
                {classificationResult.evidence.map((item) => (
                  <Text key={item} style={styles.resultEvidence}>
                    • {item}
                  </Text>
                ))}
              </View>
              {ingredientInsight ? (
                <View style={styles.breakdownCard}>
                  <Text style={styles.breakdownTitle}>Ingredient classifier</Text>
                  <View style={styles.breakdownStatusRow}>
                    <StatusPill status={ingredientInsight.status} />
                    <Text style={styles.breakdownConfidence}>
                      {(ingredientInsight.confidence * 100).toFixed(1)}% confidence
                    </Text>
                  </View>
                  <View style={styles.breakdownScores}>
                    {Object.entries(ingredientInsight.raw_scores).map(([label, value]) => (
                      <Text key={label} style={styles.breakdownScore}>
                        {label}: {(value * 100).toFixed(1)}%
                      </Text>
                    ))}
                  </View>
                </View>
              ) : null}
              {barcodeInsight ? (
                <View style={styles.breakdownCard}>
                  <Text style={styles.breakdownTitle}>Barcode classifier</Text>
                  <View style={styles.breakdownStatusRow}>
                    <StatusPill status={barcodeInsight.status} />
                    <Text style={styles.breakdownConfidence}>
                      {(barcodeInsight.confidence * 100).toFixed(1)}% confidence
                    </Text>
                  </View>
                  <View style={styles.breakdownScores}>
                    {Object.entries(barcodeInsight.raw_scores).map(([label, value]) => (
                      <Text key={label} style={styles.breakdownScore}>
                        {label}: {(value * 100).toFixed(1)}%
                      </Text>
                    ))}
                  </View>
                </View>
              ) : null}
              {logoInsight ? (
                <View style={styles.breakdownCard}>
                  <Text style={styles.breakdownTitle}>Halal logo detection</Text>
                  <Text style={styles.breakdownScore}>
                    {logoInsight.detected ? 'Logo detected on packaging' : 'Logo not detected'}
                  </Text>
                  <Text style={styles.breakdownConfidence}>
                    {(logoInsight.confidence * 100).toFixed(1)}% confidence
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 88,
    backgroundColor: colors.background,
  },
  heroCard: {
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 28,
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
  summaryCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 24,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
  },
  summaryValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summaryDescription: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  modeList: {
    marginBottom: 24,
  },
  modeCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
  },
  modeCardActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  modeCardInactive: {
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  modeSpacing: {
    marginTop: 16,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeCopy: {
    flex: 1,
    paddingRight: 18,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modeDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  modeIndicator: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeIndicatorActive: {
    backgroundColor: colors.accent,
  },
  modeIndicatorIdle: {
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  modeIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  modeIndicatorTextActive: {
    color: '#022c22',
  },
  tipCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 24,
    marginBottom: 24,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipRowSpacing: {
    marginTop: 14,
  },
  tipBullet: {
    marginRight: 12,
    marginTop: 2,
    fontSize: 18,
    fontWeight: '700',
    color: colors.accentSoft,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionSpacing: {
    flex: 1,
    marginRight: 12,
  },
  actionSpacingEnd: {
    flex: 1,
  },
  resultCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 24,
    marginTop: 24,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  resultSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultIngredients: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSubtle,
  },
  previewImage: {
    marginTop: 16,
    width: '100%',
    height: 220,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  resultStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  resultStatus: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultEvidenceList: {
    marginTop: 16,
  },
  resultEvidence: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
    marginTop: 6,
  },
  breakdownCard: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  breakdownStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  breakdownConfidence: {
    marginLeft: 12,
    fontSize: 13,
    color: colors.textSecondary,
  },
  breakdownScores: {
    marginTop: 12,
  },
  breakdownScore: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
  },
  resultHint: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  resultError: {
    marginTop: 16,
    fontSize: 14,
    color: colors.danger,
  },
});



