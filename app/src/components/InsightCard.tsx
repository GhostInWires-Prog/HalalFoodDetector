import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type InsightCardProps = {
  icon: IoniconName;
  title: string;
  description: string;
};

export const InsightCard = memo(function InsightCard({ icon, title, description }: InsightCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <Ionicons name={icon} size={24} color="#34d399" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 20,
  },
  iconBadge: {
    marginBottom: 12,
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.18)',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});


