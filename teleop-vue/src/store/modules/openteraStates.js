
const OpenteraStates = {
    namespaced: true,
    state: () => ({
        clientList: []
    }),
    mutations: {
        pushClient(state, payload) {
            state.clientList.push(payload);
        },
        removeClientById(state, id) {
            state.clientList = state.clientList.filter(client => client.id !== id);
        }
    },
    actions: {},
    getters: {}
}

export default OpenteraStates;