import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { isAxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';

import { ChatBubble } from '../components/ChatBubble';
import { QuickActionButton } from '../components/QuickActionButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionHeader } from '../components/SectionHeader';
import { SafeFlashList } from '../components/SafeFlashList';
import { loog } from '../lib/loogin';
import { halalGuidanceService } from '../services/halalGuidanceService';
import { chatService } from '../services/chatService';
import { colors } from '../theme/colors';

type ChatMessage = {
  id: string;
  author: 'assistant' | 'user';
  content: string;
  timestamp: string;
};

type ComposerValues = {
  message: string;
};

const SYSTEM_PROMPT =
  'You are Noor, a halal compliance co-pilot. Provide actionable, concise guidance about halal certification, ingredients, and supply chain practices. Cite when unsure and encourage consulting accredited halal authorities when necessary.';

export function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => halalGuidanceService.getChatSeed());

  const { control, handleSubmit, reset, watch } = useForm<ComposerValues>({
    defaultValues: { message: '' },
  });

  const hasContent = watch('message').trim().length > 0;

  const suggestedPrompts = useMemo(
    () => [
      'Highlight haram additives for sauces',
      'How to certify a new supplier?',
      'Are E-numbers 470–472 halal?',
    ],
    [],
  );

  const { mutateAsync: requestCompletion, isPending } = useMutation({
    mutationFn: chatService.createChatCompletion,
  });

  const sendMessage = useCallback(
    async (rawMessage: string) => {
      const trimmedMessage = rawMessage.trim();

      if (!trimmedMessage) {
        loog.debug('Skipping empty chat submission');
        return;
      }

      if (isPending) {
        loog.warn('Chat completion request already in flight');
        return;
      }

      const timestampLabel = 'Just now';
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        author: 'user',
        content: trimmedMessage,
        timestamp: timestampLabel,
      };

      const placeholderId = `assistant-${Date.now() + 1}`;
      const assistantPlaceholder: ChatMessage = {
        id: placeholderId,
        author: 'assistant',
        content: 'Thinking through halal guidance...',
        timestamp: 'Processing...',
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);

      const serializedConversation = [
        ...messages
          .filter((message) => message.id.startsWith('user-') || message.id.startsWith('assistant-'))
          .map((message) => ({
            role: message.author,
            content: message.content,
          })),
        {
          role: 'user' as const,
          content: trimmedMessage,
        },
      ];

      try {
        const response = await requestCompletion({
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },
            ...serializedConversation,
          ],
        });

        const assistantContent = response.message.content.trim() || 'I do not have guidance to share yet.';

        setMessages((prev) => {
          let replaced = false;
          const next = prev.map((message) => {
            if (message.id === placeholderId) {
              replaced = true;
              return {
                ...message,
                content: assistantContent,
                timestamp: timestampLabel,
              };
            }
            return message;
          });

          if (!replaced) {
            next.push({
              id: placeholderId,
              author: 'assistant',
              content: assistantContent,
              timestamp: timestampLabel,
            });
          }

          return next;
        });
        loog.info('Assistant response received', { content: assistantContent });
      } catch (error) {
        const serverDetail =
          isAxiosError(error) && error.response?.data && typeof error.response.data.detail === 'string'
            ? error.response.data.detail
            : undefined;
        const fallbackMessage =
          serverDetail ??
          (isAxiosError(error) && typeof error.message === 'string'
            ? error.message
            : 'Sorry, I ran into an issue responding. Please try again shortly.');

        loog.error('Chat completion failed', { error, serverDetail });
        setMessages((prev) => {
          let replaced = false;
          const next = prev.map((message) => {
            if (message.id === placeholderId) {
              replaced = true;
              return {
                ...message,
                content: fallbackMessage,
                timestamp: timestampLabel,
              };
            }
            return message;
          });

          if (!replaced) {
            next.push({
              id: placeholderId,
              author: 'assistant',
              content: fallbackMessage,
              timestamp: timestampLabel,
            });
          }
          return next;
        });
      }
    },
    [isPending, messages, requestCompletion],
  );

  const onSubmit = useCallback(
    async (values: ComposerValues) => {
      await sendMessage(values.message);
      reset();
    },
    [reset, sendMessage],
  );

  const handlePromptPress = useCallback(
    (prompt: string) => {
      loog.info('Prompt selected', { prompt });
      void sendMessage(prompt);
      reset();
    },
    [reset, sendMessage],
  );

  const renderMessageBubble = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <View style={styles.messageSpacing}>
        <ChatBubble author={item.author} content={item.content} timestamp={item.timestamp} />
      </View>
    ),
    [],
  );

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.select({ ios: 84, android: 0 })}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={[colors.surfaceAlt, colors.surface, colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.overline}>Assistant</Text>
          <Text style={styles.heroTitle}>Talk to Noor, your halal co-pilot</Text>
          <Text style={styles.heroSubtitle}>
            Ask any question about ingredients, certification workflows, or supply chain provenance.
          </Text>
        </LinearGradient>

        <SectionHeader
          title="Chat with Noor"
          subtitle="Ask about ingredients, certifications, or supply chain compliance"
        />

        <View style={styles.promptRow}>
          {suggestedPrompts.map((prompt, index) => (
            <View key={prompt} style={index % 2 === 0 ? styles.promptCell : styles.promptCellAlt}>
              <QuickActionButton
                icon="sparkles"
                label={prompt}
                onPress={() => handlePromptPress(prompt)}
                tone="secondary"
                fullWidth={false}
              />
            </View>
          ))}
        </View>

        <View style={styles.chatContainer}>
          <SafeFlashList
            data={messages}
            estimatedItemSize={120}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageBubble}
            contentContainerStyle={{ paddingBottom: 12 }}
            extraData={messages}
          />
        </View>

        <View style={styles.composerCard}>
          <Controller
            control={control}
            name="message"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Ask the halal assistant..."
                placeholderTextColor="#64748b"
                multiline
                style={styles.composerInput}
              />
            )}
          />
          <View style={styles.composerActions}>
            <QuickActionButton
              icon="send"
              label="Send"
              onPress={handleSubmit(onSubmit)}
              tone={hasContent ? 'primary' : 'secondary'}
              fullWidth={false}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  promptRow: {
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  promptCell: {
    marginRight: 12,
    marginBottom: 12,
  },
  promptCellAlt: {
    marginBottom: 12,
    marginRight: 0,
  },
  chatContainer: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
    padding: 16,
  },
  messageSpacing: {
    marginBottom: 12,
  },
  composerCard: {
    marginTop: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surfaceAlt,
    padding: 16,
  },
  composerInput: {
    minHeight: 48,
    maxHeight: 140,
    fontSize: 16,
    color: colors.textPrimary,
  },
  composerActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});


