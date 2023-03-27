import test from 'ava'
import pomodoroCore from './src/js/pomodoro-core.js'

test('Pomodoro core should exist', t => {
	t.truthy(pomodoroCore(x => x))
});

test('Add and remove pomodoros should work properly', t => {
    const pomodoro = pomodoroCore(x => x);
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
    const pomodoro = pomodoroCore(x => x);
    ['Pomodoro 1', 'Pomodoro 2', 'Pomodoro 3', 'Pomodoro 4'].forEach(text => {
        pomodoro.new_pomodoro_text = text;
        pomodoro.add()
    })
    const pomodoro1 = pomodoro.pomodoros.find(pomodoro => pomodoro.text === 'Pomodoro 1')
    const pomodoro2 = pomodoro.pomodoros.find(pomodoro => pomodoro.text === 'Pomodoro 2')
    const pomodoro3 = pomodoro.pomodoros.find(pomodoro => pomodoro.text === 'Pomodoro 3')
    const pomodoro4 = pomodoro.pomodoros.find(pomodoro => pomodoro.text === 'Pomodoro 4')

    pomodoro.run(pomodoro1)
    t.is(pomodoro1.state, 'running')
    pomodoro.run(pomodoro1)
    t.is(pomodoro1.state, 'running')
    pomodoro.run(pomodoro2)
    t.is(pomodoro1.state, 'paused')
    pomodoro.run(pomodoro3)
    pomodoro.finish(pomodoro3)
    t.is(pomodoro3.state, 'finished')
    pomodoro.finish(pomodoro4)
    t.is(pomodoro4.state, 'paused')
    pomodoro.pause(pomodoro4)
    t.is(pomodoro4.state, 'paused')
})


