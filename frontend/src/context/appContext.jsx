import { createContext, useContext } from 'react'

const appContext = createContext()

export const useAppContext = () => {
    return useContext(appContext)
}

const AppContextProvider = (props) => {
    const url = 'http://localhost:8000'
    const appContextValue = {
        url
    }

    return (
        <appContext.Provider value={appContextValue}>
            {props.children}
        </appContext.Provider>
    )
}

export default AppContextProvider;