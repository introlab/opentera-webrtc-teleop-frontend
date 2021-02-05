
const OpenteraStates = {
    namespaced: true,
    state: () => ({
        clientList: [],
        isInCall: false,
        isMuted: false,
        isCameraOff: false
    }),
    mutations: {
        pushClient(state, payload) {
            state.clientList.push(payload);
        },
        removeClientById(state, id) {
            state.clientList = state.clientList.filter(client => client.id !== id);
        },

        // Event mutations
        setCallState(state, bool) {
            state.isInCall = bool;
        },
        setMuteState(state, bool) {
            state.isMuted = bool;
        },
        setCameraState(state, bool) {
            state.isCameraOff = bool;
        }
    },
    actions: {},
    getters: {}
}

export default OpenteraStates;