import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatusTone = 'Halal' | 'Haram' | 'Doubtful';

type StatusPillProps = {
  status: StatusTone;
};

export const StatusPill = memo(function StatusPill({ status }: StatusPillProps) {
  const palette = useMemo(() => {
    switch (status) {
      case 'Halal':
        return {
          container: styles.halalPill,
          text: styles.halalText,
        };
      case 'Haram':
        return {
          container: styles.haramPill,
          text: styles.haramText,
        };
      default:
        return {
          container: styles.doubtfulPill,
          text: styles.doubtfulText,
        };
    }
  }, [status]);

  return (
    <View style={[styles.pill, palette.container]}>
      <Text style={[styles.label, palette.text]}>{status}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  halalPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  halalText: {
    color: '#6EE7B7',
  },
  haramPill: {
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.28)',
  },
  haramText: {
    color: '#FCA5A5',
  },
  doubtfulPill: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.28)',
  },
  doubtfulText: {
    color: '#FACC15',
  },
});


