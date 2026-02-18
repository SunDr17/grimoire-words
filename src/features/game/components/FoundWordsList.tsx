import React, { useRef, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/shared/constants'
import { scoreWord } from '@/features/board/utils/boardSolver'

interface FoundWordsListProps {
  readonly words: readonly string[]
}

export function FoundWordsList({ words }: FoundWordsListProps) {
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (words.length > 0 && scrollRef.current) {
      const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)
      return () => clearTimeout(timer)
    }
  }, [words.length])

  if (words.length === 0) return null

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {words.map((word, index) => (
          <View key={`${word}-${index}`} style={styles.wordTag}>
            <Text style={styles.wordText}>{word.toUpperCase()}</Text>
            <Text style={styles.scoreText}>+{scoreWord(word)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    marginVertical: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  wordTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grimoire.primary + 'CC',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.grimoire.secondary + '44',
    gap: SPACING.xs,
  },
  wordText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    color: COLORS.grimoire.parchment,
    fontWeight: '600',
  },
  scoreText: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.xs,
    color: COLORS.neon.green,
  },
})
