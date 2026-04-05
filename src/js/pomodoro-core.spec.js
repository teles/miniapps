import { describe, expect, it } from 'vitest'
import pomodoroCore from './pomodoro-core.js'

const AlpineMocked = {
	$persist: x => x
}

describe('pomodoro core', () => {
  it('should exist', () => {
    expect(pomodoroCore(AlpineMocked)).toBeTruthy()
  })

  it('add and remove pomodoros should work properly', () => {
    const pomodoro = pomodoroCore(AlpineMocked);
    const initial_pomodoros_length = pomodoro.pomodoros.length;
    pomodoro.new_pomodoro_text = 'Example 1'
    pomodoro.add()
    pomodoro.new_pomodoro_text = 'Example 2'
    pomodoro.add()    
    pomodoro.new_pomodoro_text = 'Example 3'
    pomodoro.add()
    expect(pomodoro.pomodoros.length).toBe(initial_pomodoros_length + 3)
    pomodoro.add()
    expect(pomodoro.pomodoros.length).toBe(initial_pomodoros_length + 3)
    pomodoro.remove(pomodoro.pomodoros.at(-1))
    expect(pomodoro.pomodoros.length).toBe(initial_pomodoros_length + 2)
    pomodoro.remove(pomodoro.pomodoros.at(-1))
    expect(pomodoro.pomodoros.length).toBe(initial_pomodoros_length + 1)
    pomodoro.remove(pomodoro.pomodoros.at(-1))
    expect(pomodoro.pomodoros.length).toBe(initial_pomodoros_length)
  })

  it('update from one state to another works properly', () => {
    const pomodoro = pomodoroCore(AlpineMocked);
    ['Pomodoro 1', 'Pomodoro 2', 'Pomodoro 3', 'Pomodoro 4'].forEach(text => {
        pomodoro.new_pomodoro_text = text;
        pomodoro.add()
    })
    const pomodoro1 = pomodoro.pomodoros.find(pomodoro => pomodoro.text === 'Pomodoro 1')
    const pomodoro2 = pomodoro.pomodoros.find(pomodoro => pomodoro.text === 'Pomodoro 2')
    const pomodoro3 = pomodoro.pomodoros.find(pomodoro => pomodoro.text === 'Pomodoro 3')
    const pomodoro4 = pomodoro.pomodoros.find(pomodoro => pomodoro.text === 'Pomodoro 4')

    pomodoro.update_state('running', pomodoro1)
    expect(pomodoro1.state).toBe('running')
    pomodoro.update_state('running', pomodoro1)
    expect(pomodoro1.state).toBe('running')
    pomodoro.update_state('running', pomodoro2)
    expect(pomodoro1.state).toBe('paused')
    pomodoro.update_state('running', pomodoro3)
    pomodoro.update_state('finished', pomodoro3)
    expect(pomodoro3.state).toBe('finished')
    pomodoro.update_state('finished', pomodoro4)
    expect(pomodoro4.state).toBe('paused')
    pomodoro.update_state('paused', pomodoro4)
    expect(pomodoro4.state).toBe('paused')
  })
})
