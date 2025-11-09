import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ChatBubbleProps = {
  author: 'assistant' | 'user';
  content: string;
  timestamp: string;
};

export const ChatBubble = memo(function ChatBubble({ author, content, timestamp }: ChatBubbleProps) {
  const palette = useMemo(() => {
    if (author === 'assistant') {
      return {
        container: [styles.bubble, styles.assistantBubble],
        text: styles.assistantText,
        meta: styles.assistantMeta,
      };
    }
    return {
      container: [styles.bubble, styles.userBubble],
      text: styles.userText,
      meta: styles.userMeta,
    };
  }, [author]);

  return (
    <View style={palette.container}>
      <Text style={[styles.message, palette.text]}>{content}</Text>
      <Text style={[styles.timestamp, palette.meta]}>{timestamp}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    backgroundColor: '#1f2937',
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
    backgroundColor: '#34d399',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    marginTop: 8,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  assistantText: {
    color: '#F8FAFC',
  },
  assistantMeta: {
    color: '#94A3B8',
  },
  userText: {
    color: '#064E3B',
    fontWeight: '600',
  },
  userMeta: {
    color: '#065F46',
  },
});


