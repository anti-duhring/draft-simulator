import { useState } from "react"
import DraftOrderContainer from "../DraftOrder/DraftOrderContainer"
import DraftPicksContainer from "../DraftPicks/Container"

const Home = () => {
    const [step, setStep] = useState('order');
    const [draftOrder, setDraftOrder] = useState(null);
    const [myTeams, setMyTeams] = useState(null);

    return (
        <>
            {step=='order' && 
            <DraftOrderContainer 
                step={step} 
                setStep={setStep} 
                draftOrder={draftOrder} 
                setDraftOrder={setDraftOrder} 
                myTeams={myTeams}
                setMyTeams={setMyTeams}
            />}
            {step=='picks' && 
            <DraftPicksContainer 
                step={step} 
                setStep={setStep} 
                draftOrder={draftOrder} 
                setDraftOrder={setDraftOrder} 
                myTeams={myTeams}
                setMyTeams={setMyTeams} 
            />}
        </>
    )
}

export default Home