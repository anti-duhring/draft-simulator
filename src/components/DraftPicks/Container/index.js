import { useState } from "react";
import Button from "../../Button"
import styled from "styled-components";
import DraftList from "../DraftList";
import DraftMenu from "../DraftMenu";

const DraftPicksContainer = (props) => {
    const [currentPick, setCurrentPick] = useState(1);
    const backToDraftOrder = () => {
        props.setStep('order');
    }

    return (
        <Container>
            <DraftList 
                currentPick={currentPick} 
                setCurrentPick={setCurrentPick} 
                draftOrder={props.draftOrder}
                myTeams={props.myTeams} 
            />
            <div className="footer">
                <Button onClick={backToDraftOrder}>Voltar</Button>
                <Button>Finalizar Draft</Button>
            </div>
            <Sticky>
                <DraftMenu 
                    myTeams={props.myTeams} 
                    draftOrder={props.draftOrder} 
                    currentPick={currentPick} 
                    setCurrentPick={setCurrentPick} 
                />
            </Sticky>
        </Container>
    )
}

export default DraftPicksContainer;

const Container = styled.div`
    width: 100%;
`
const Sticky = styled.div`
    position: fixed;
    bottom: .5rem;
    right: 1rem;
`