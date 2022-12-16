export default {
    namespaced: true,
    state: () => (
        {
            moment: null,
            fullScreen: false,
            darkMode: false,
            timeZone: 'Asia/Seoul',
        }
    ),
    getters: {

    },
    mutations: {
        setMoment(state, value) {
            state.moment = value;
        },
        setFullScreen(state, value) {
            state.fullScreen = value;
        }
    },
    actions: {}
}