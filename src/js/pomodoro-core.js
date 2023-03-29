const stages = [
    {
        name: 'focus_paused',
        styles: {
            base: 'bg-gray-50 border-gray-200 text-gray-500',
            progress_bg: 'bg-gray-100',
            progress_bar: 'bg-gray-500',
            timer_action: 'bg-gray-500',
            timer: 'bg-gray-400 text-gray-100'
        },
        type: 'paused', // icon: pause
        status: 'focus', // time_left
        on_click: 'focus_running',
        button: 'remove'
    },
    {   
        name: 'focus_running',            
        styles: {
            base: 'bg-yellow-50 border-yellow-200 text-yellow-500',
            progress_bg: 'bg-yellow-100',
            progress_bar: 'bg-yellow-500',
            timer_action: 'bg-yellow-500',
            timer: 'bg-yellow-400 text-yellow-100'
        },
        type: 'running', // icon: play, pause others
        status: 'focus', // time_left
        on_click: 'focus_paused',
        on_countdown: 'focus_finished',
        button: 'remove'
    },
    {
        name: 'focus_finished',
        styles: {
            base: 'bg-blue-50 border-blue-200 text-blue-500',
            progress_bg: 'bg-blue-100',
            progress_bar: 'bg-blue-500',
            timer_action: 'bg-blue-500',
            timer: 'bg-blue-400 text-blue-100'
        },
        type: 'paused', // icon: play, pause others
        status: 'focus', // time_left
        on_click: 'breaking_running',
        button: 'remove'
    },
    {
        name: 'breaking_running',
        styles: {
            base: 'bg-blue-50 border-blue-200 text-blue-500',
            progress_bg: 'bg-blue-100',
            progress_bar: 'bg-blue-500',
            timer_action: 'bg-blue-500',
            timer: 'bg-blue-400 text-blue-100'
        },
        type: 'running', // icon: play, pause others
        status: 'breaking', // breaking_left
        on_click: 'breaking_paused',
        on_countdown: 'breaking_finished',
        button: 'remove'
    },
    {
        name: 'breaking_paused',
        styles: {
            base: 'bg-blue-50 border-blue-200 text-blue-500',
            progress_bg: 'bg-blue-100',
            progress_bar: 'bg-blue-500',
            timer_action: 'bg-blue-500',
            timer: 'bg-blue-400 text-blue-100'
        },
        type: 'paused', // icon: pause, pause others
        status: 'breaking', // breaking_left
        on_click: 'breaking_running',
        on_countdown: 'breaking_finished',
        button: 'remove'
    },
    {
        name: 'breaking_finished',
        styles: {
            base: 'bg-green-50 border-green-200 text-green-500',
            progress_bg: 'bg-green-100',
            progress_bar: 'bg-green-500',
            timer_action: 'bg-green-500',
            timer: 'bg-green-400 text-green-100'
        },
        type: 'paused', // icon: pause, pause others
        status: 'breaking', // breaking_left
        on_click: 'breaking_finished',
        button: 'remove'
    },
    {
        name: 'archived',
        styles: {
            base: 'bg-green-50 border-green-200 text-green-500',
            progress_bg: 'bg-green-100',
            progress_bar: 'bg-green-500',
            timer_action: 'bg-green-500',
            timer: 'bg-green-400 text-green-100'
        },
        type: 'paused', // icon: pause, pause others
        status: 'breaking', // breaking_left
        on_click: 'breaking_finished',
        button: 'remove'
    }    
]

export default function (Alpine) {
    const seconds_focus = 25 * 60
    const seconds_breaking = 5 * 60
    const get_mockup_pomodoro = (text, stage) => ({
        text,
        stage,
        is_editing: false,
        time_left: seconds_focus,
        breaking_left: seconds_breaking,
        started_at: new Date,
        finished_at: null
    })

    return {
        icons: {
            cog: 'M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z',
            play: 'M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z',
            check: 'M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z',
            trash: 'M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z',
            pause: 'M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z',
        },
        stages: stages.reduce((total, stage) => {      
            const appendix = {
                timer_icon: {
                    'paused': 'play',
                    'running': 'pause'                    
                }[stage.type],
                timer_property: {
                    'focus': 'time_left',
                    'breaking': 'breaking_left'
                }[stage.status],
                timer_initial: {
                    'focus': seconds_focus,
                    'breaking': seconds_breaking
                }[stage.status],
                button_style: {
                    'remove': 'bg-red-500'
                }[stage.button],
                button_callback: {
                    'remove': 'remove'
                }[stage.button],
                button_icon: {
                    'remove': 'trash'
                }[stage.button]                
            }
            stage.styles = Object.assign(stage.styles, { button: appendix.button_style })
            total.push(Object.assign(stage, appendix))
            return total;
        }, []),
        configs: Alpine.$persist({
            running_first: false,
            start_anytime: true
        }),
        tabs: Alpine.$persist({
            active: 'home',
            items: [
                {
                    id: 'home',
                    label: 'Home',
                    is_blinking: false,
                },
                {
                    id: 'archived',
                    label: 'Archived',
                    is_blinking: false,
                },
                {
                    id: 'configs',
                    icon: 'cog',
                    extra_class: 'ml-auto',
                    is_blinking: false
                }
            ]
        }),  
        stages_map: stages.reduce((total, stage) => {
            total[stage.name] = stage;
            return total;
        }, {}),
        pomodoros: Alpine.$persist([
            get_mockup_pomodoro('Buy tomatos', 'focus_running'),
            get_mockup_pomodoro('Defeat Thanos and save the entire universe', 'focus_paused'),
            get_mockup_pomodoro('Wash dishes', 'focus_finished')
        ]),
        get_stage_by_pomodoro(pomodoro) {
            return stages.find(stage => stage.name === pomodoro.stage)
        },
        get_paused_stage_by_pomodoro(pomodoro) {
            return stages.find(stage => stage.name === pomodoro.stage && stage.type === 'paused')
        },        
        pomodoros_archived: Alpine.$persist([]),
        handle_timer_click(pomodoro) { 
            pomodoro.stage = this.get_stage_by_pomodoro(pomodoro).on_click
        },
        handle_button_click(pomodoro, button_name) {
            const callback = {
                'remove': (pomodoro) => {
                    console.log('remove: ', pomodoro)
            }}[button_name]
            callback(pomodoro);
        },
        countdown(pomodoro) {
            const pomodoro_stage = this.get_stage_by_pomodoro(pomodoro)
            if(pomodoro_stage.type === 'running') {
                pomodoro[pomodoro_stage.timer_property] > 0 && pomodoro[pomodoro_stage.timer_property]--
            }
        },
        new_pomodoro_text: '',
        new_pomodoro_placeholder: 'Something you can do in a pomodoro',
        add() {
            if (this.new_pomodoro_text.length > 0) {
                this.pomodoros.push({
                    text: this.new_pomodoro_text,
                    stage: 'focus_paused',
                    time_left: 25 * 60,
                    breaking_left: 5 * 60,
                    is_editing: false,
                    started_at: new Date,
                    finished_at: null
                })
            }
            this.new_pomodoro_text = '';
        }
    }
}