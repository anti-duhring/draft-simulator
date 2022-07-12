import Header from "../Header";

const Body = ({children}) => {
    return (
        <div className="wrap">
            <Header />
            {children}
        </div>
    )
}

export default Body;