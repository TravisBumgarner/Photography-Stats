import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { ModalProvider } from 'styled-react-modal'
import { darken } from 'polished'

import Context, { context } from 'Context'
import { Error, Home } from './pages'


const App = () => {
    const { state } = React.useContext(context)
    const [showAutomatedBackupModal, setShowAutomatedBackupModal] = React.useState<boolean>(false)

    return (
        <div>
            <h1>Photography Stats</h1>
            <Home />
        </div>
    )
}

class ErrorBoundary extends React.Component<{ children: any }, { hasError: boolean, error: string }> {
    constructor(props: any) {
        super(props)
        this.state = {
            hasError: false,
            error: ''
        }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: unknown) {
        this.setState({ error: `${JSON.stringify(error.message)}\n${JSON.stringify(errorInfo)}` })
    }

    render() {
        if (this.state.hasError) {
            return (
                <Error />
            )
        }

        return this.props.children
    }
}

const InjectedApp = () => {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Context>
                    <App />
                </Context>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

export default InjectedApp
