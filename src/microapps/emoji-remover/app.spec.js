import { describe, expect, it } from 'vitest'
import {
    extractUniqueEmojis,
    removeAllEmojis,
    removeSpecificEmojis,
    countEmojiMatches
} from './app.js'

describe('extractUniqueEmojis', () => {
    it('returns empty array when no emojis', () => {
        expect(extractUniqueEmojis('Hello world')).toEqual([])
    })

    it('extracts a single emoji', () => {
        expect(extractUniqueEmojis('Hello 😀')).toEqual(['😀'])
    })

    it('deduplicates repeated emojis', () => {
        expect(extractUniqueEmojis('😀 text 😀 more 😀')).toEqual(['😀'])
    })

    it('extracts multiple distinct emojis in order of first appearance', () => {
        expect(extractUniqueEmojis('😀 hello 🎉 world')).toEqual(['😀', '🎉'])
    })
})

describe('countEmojiMatches', () => {
    it('returns 0 for text without emojis', () => {
        expect(countEmojiMatches('Hello world')).toBe(0)
    })

    it('counts repeated occurrences separately', () => {
        expect(countEmojiMatches('😀 😀 😀')).toBe(3)
    })

    it('counts each emoji in a sequence', () => {
        expect(countEmojiMatches('😀🎉🔥')).toBe(3)
    })
})

describe('removeAllEmojis — basic', () => {
    it('returns text unchanged when no emojis', () => {
        expect(removeAllEmojis('Hello world')).toBe('Hello world')
    })

    it('removes a lone emoji', () => {
        expect(removeAllEmojis('😀')).toBe('')
    })

    it('removes emoji embedded in word without touching surrounding chars', () => {
        expect(removeAllEmojis('Hello😀World')).toBe('HelloWorld')
    })
})

describe('removeAllEmojis — space cleanup', () => {
    it('removes emoji at start of line and its trailing space', () => {
        expect(removeAllEmojis('😀 Hello')).toBe('Hello')
    })

    it('removes emoji at start of line without trailing space', () => {
        expect(removeAllEmojis('😀Hello')).toBe('Hello')
    })

    it('collapses double space when emoji is between two words', () => {
        expect(removeAllEmojis('Hello 😀 world')).toBe('Hello world')
    })

    it('removes emoji at end of line along with its preceding space', () => {
        expect(removeAllEmojis('Hello 😀')).toBe('Hello')
    })

    it('removes multiple emojis at line start with trailing space', () => {
        expect(removeAllEmojis('😀🎉 Hello')).toBe('Hello')
    })

    it('handles multiline text — emoji at start of second line', () => {
        expect(removeAllEmojis('First line\n😀 Second line')).toBe('First line\nSecond line')
    })

    it('handles multiline text — emoji in middle of each line', () => {
        const input = 'Hello 😀 world\nFoo 🎉 bar'
        const expected = 'Hello world\nFoo bar'
        expect(removeAllEmojis(input)).toBe(expected)
    })

    it('preserves intentional spacing not related to emojis', () => {
        expect(removeAllEmojis('word1 word2')).toBe('word1 word2')
    })
})

describe('removeSpecificEmojis', () => {
    it('returns text unchanged when list is empty', () => {
        expect(removeSpecificEmojis('Hello 😀', [])).toBe('Hello 😀')
    })

    it('removes only the targeted emoji, keeps others', () => {
        expect(removeSpecificEmojis('😀 Hello 🎉', ['😀'])).toBe('Hello 🎉')
    })

    it('cleans trailing space when removing emoji at start of line', () => {
        expect(removeSpecificEmojis('😀 Hello', ['😀'])).toBe('Hello')
    })

    it('collapses space when removing emoji between two words', () => {
        expect(removeSpecificEmojis('Hello 😀 world', ['😀'])).toBe('Hello world')
    })

    it('removes emoji at end of line along with preceding space', () => {
        expect(removeSpecificEmojis('Hello 😀', ['😀'])).toBe('Hello')
    })

    it('leaves text unchanged when emoji is not in the removal list', () => {
        expect(removeSpecificEmojis('Hello 🎉 world', ['😀'])).toBe('Hello 🎉 world')
    })

    it('removes multiple targeted emojis in one pass', () => {
        expect(removeSpecificEmojis('😀 Hello 🎉 world 🔥', ['😀', '🔥'])).toBe('Hello 🎉 world')
    })
})
