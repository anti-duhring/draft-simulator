import { useState, useContext } from "react"
import DraftOrderContainer from "../DraftOrder/DraftOrderContainer"
import DraftPicksContainer from "../DraftPicks/Container"
import {DraftContext} from "../../Context/DraftContext"
import styled from 'styled-components'
import GeneratedImage from "../GeneratedImage/Container"

const Home = () => {
    /*const [step, setStep] = useState('order');
    const [draftOrder, setDraftOrder] = useState(null);
    const [myTeams, setMyTeams] = useState(null);*/
    const {step} = useContext(DraftContext);

    return (
        <Container>
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
            {step=='finish' && 
            <GeneratedImage />}
        </Container>
    )
}

export default Home;

const Container = styled.div`
    margin-top: 1rem;
`