
const ConferenceViewStates = {
    namespaced: true,
    state: () => ({
        showParticipants: false
    }),
    mutations: {
        showParticipants(state, bool) {
            state.showParticipants = bool;
        }
    },
    actions: {},
    getters: {}
}

export default ConferenceViewStates;