import { useState, useContext } from "react"
import DraftOrderContainer from "../DraftOrder/DraftOrderContainer"
import DraftPicksContainer from "../DraftPicks/Container"
import {DraftContext} from "../../Context/DraftContext"

const Home = () => {
    /*const [step, setStep] = useState('order');
    const [draftOrder, setDraftOrder] = useState(null);
    const [myTeams, setMyTeams] = useState(null);*/
    const {step} = useContext(DraftContext);

    return (
        <>
            {step=='order' && 
            <DraftOrderContainer />}
            {step=='picks' && 
            <DraftPicksContainer 
               /* step={step} 
                setStep={setStep} 
                draftOrder={draftOrder} 
                setDraftOrder={setDraftOrder} 
                myTeams={myTeams}
                setMyTeams={setMyTeams} */
            />}
        </>
    )
}

export default Home