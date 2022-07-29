import { useState, useContext } from "react";
import Button from "../../Button"
import styled from "styled-components";
import DraftList from "../DraftList";
import DraftMenu from "../DraftMenu";
import SlideScreenMobile from "../SlideScreenMobile";
import data from '../../../data/players.json'
import { DraftContext } from "../../../Context/DraftContext";
import { isMobile } from "react-device-detect";
import ActionScreenDesktop from "../../ActionScreenDesktop/Container";

//console.log(data.players.map(item => item.id));

const DraftPicksContainer = (props) => {
    data.players.sort((a, b) => a.pff_rank - b.pff_rank);
    const {
        step, 
        setStep,
        currentPick,
        allPicks
    } = useContext(DraftContext);
    const [tabToShow, setTabToShow] = useState('pick');

    const backToDraftOrder = () => {
        setStep('order');
    }

    return (
        <Container>
            <Flex>
                <DraftList />
                {!isMobile && <ActionScreenDesktop />}
            </Flex>
            <div className="footer">
                <Button onClick={backToDraftOrder}>Voltar</Button>
                <Button>Finalizar Draft</Button>
            </div>
            {currentPick <= allPicks[1].length && isMobile && 
            <>
            <Sticky>
                <DraftMenu tabToShow={tabToShow} setTabToShow={setTabToShow} />
            </Sticky>
            <SlideScreenMobile tabToShow={tabToShow} setTabToShow={setTabToShow} />
            </>}
        </Container>
    )
}

export default DraftPicksContainer;

const Container = styled.div`
    width: ${isMobile ? '100%' : 'auto'};
    padding-bottom: 4rem;
`
const Sticky = styled.div`
    position: fixed;
    bottom: 3rem;
    right: 1rem;
`
const Flex = styled.div`
    display: flex;
    flex-direction: row;
`