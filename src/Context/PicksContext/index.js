import { createContext } from "react";

export const PicksContext = createContext();

export const PicksContextProvider = ({children}) => {
    return (
        <PicksContext.Provider>
            {children}
        </PicksContext.Provider>
    )
}