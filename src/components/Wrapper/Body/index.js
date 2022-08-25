import Header from "../Header";
import './style.css'

const Body = ({children}) => {
    return (
        <div className="wrap">
            <Header />
            <div className="content">
                {children}
            </div>
        </div>
    )
}

export default Body;