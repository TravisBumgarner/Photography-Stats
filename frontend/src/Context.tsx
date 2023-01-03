import React from 'react'

type State = {
}

const EMPTY_STATE: State = {
}

type ActionAction = {
    type: 'action',
}

type Action =
    | ActionAction

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'action': {
            return state
        }
        default:
            throw new Error('Unexpected action')
    }
}

const context = React.createContext(
    {
        state: EMPTY_STATE,
        dispatch: () => { },
    } as {
        state: State,
        dispatch: React.Dispatch<Action>
    },
)


const ResultsContext = ({ children }: { children: React.ReactChild }) => {
    const [state, dispatch] = React.useReducer(reducer, EMPTY_STATE)
    const { Provider } = context

    return (
        <Provider value={{ state, dispatch }}>
            {children}
        </Provider>
    )
}

export default ResultsContext
export {
    context
}
