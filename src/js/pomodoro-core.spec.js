import test from 'ava'
import pomodoroCore from './pomodoro-core.js'

const AlpineMocked = {
	$persist: x => x
}

test('Pomodoro core should exist', t => {
	t.truthy(pomodoroCore(AlpineMocked))
});

test('Add and remove pomodoros should work properly', t => {
    const pomodoro = pomodoroCore(AlpineMocked);
    const initial_pomodoros_length = pomodoro.pomodoros.length;
    pomodoro.new_pomodoro_text = 'Example 1'
    pomodoro.add()
    pomodoro.new_pomodoro_text = 'Example 2'
    pomodoro.add()    
    pomodoro.new_pomodoro_text = 'Example 3'
    pomodoro.add()
    t.is(pomodoro.pomodoros.length, initial_pomodoros_length + 3)
    pomodoro.add()
    t.is(pomodoro.pomodoros.length, initial_pomodoros_length + 3)
    pomodoro.remove(pomodoro.pomodoros.at(-1))
    t.is(pomodoro.pomodoros.length, initial_pomodoros_length + 2)
    pomodoro.remove(pomodoro.pomodoros.at(-1))
    t.is(pomodoro.pomodoros.length, initial_pomodoros_length + 1)
    pomodoro.remove(pomodoro.pomodoros.at(-1))
    t.is(pomodoro.pomodoros.length, initial_pomodoros_length)
})

test('Update from one state to anothe works properly', t => {
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
    t.is(pomodoro1.state, 'running')
    pomodoro.update_state('running', pomodoro1)
    t.is(pomodoro1.state, 'running')
    pomodoro.update_state('running', pomodoro2)
    t.is(pomodoro1.state, 'paused')
    pomodoro.update_state('running', pomodoro3)
    pomodoro.update_state('finished', pomodoro3)
    t.is(pomodoro3.state, 'finished')
    pomodoro.update_state('finished', pomodoro4)
    t.is(pomodoro4.state, 'paused')
    pomodoro.update_state('paused', pomodoro4)
    t.is(pomodoro4.state, 'paused')
})