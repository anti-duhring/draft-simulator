import Header from "../Header";
import './style.css'

const Body = ({children}) => {
    return (
        <div className="wrap">
            <Header />
            {children}
        </div>
    )
}

export default Body;