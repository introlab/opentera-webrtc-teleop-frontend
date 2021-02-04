
const OpenteraStates = {
    namespaced: true,
    state: () => ({
        clientList: [],
        isInCall: false
    }),
    mutations: {
        pushClient(state, payload) {
            state.clientList.push(payload);
        },
        removeClientById(state, id) {
            state.clientList = state.clientList.filter(client => client.id !== id);
        },
        callAll(state) {
            state.isInCall = true;
        },
        hangUpAll(state) {
            state.isInCall = false;
        }
    },
    actions: {},
    getters: {}
}

export default OpenteraStates;