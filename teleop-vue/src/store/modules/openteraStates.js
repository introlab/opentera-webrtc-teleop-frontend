
const OpenteraStates = {
    namespaced: true,
    state: () => ({
        thisClient: {},
        clientsInCall: [],
        clientsInRoom: [],
        isInCall: false,
        isMuted: false,
        isCameraOff: false
    }),
    mutations: {
        setThisClient(state, payload) {
            state.thisClient = payload;
        },
        pushClientInCall(state, payload) {
            state.clientsInCall.push(payload);
        },
        removeClientInCallById(state, id) {
            state.clientsInCall = state.clientsInCall.filter(client => client.id !== id);
        },
        setClientInRoom(state, payload) {
            state.clientsInRoom = payload;
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