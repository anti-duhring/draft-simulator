import { useState, useContext } from "react";
import Button from "../../Button"
import styled from "styled-components";
import DraftList from "../DraftList";
import DraftMenu from "../DraftMenu";
import SlideScreenMobile from "../SlideScreenMobile";
import data from '../../../data/players.json'
import { DraftContext } from "../../../Context/DraftContext";
import { isMobile } from "react-device-detect";
import ActionScreenDesktop from "../ActionScreenDesktop/Container";

//console.log(data.players.map(item => item.id));

const DraftPicksContainer = (props) => {
    data.players.sort((a, b) => a.pff_rank - b.pff_rank);
    const {
        step, 
        setStep,
        currentPick,
        allPicks
    } = useContext(DraftContext);
    

    const backToDraftOrder = () => {
        setStep('order');
    }

    return (
        <Container>
            <Flex>
                <DraftList />
                {!isMobile && <ActionScreenDesktop />}
            </Flex>
            <Footer>
                <Button disabled={currentPick != 0} onClick={() => setStep('finish')}>
                    Finalizar Draft
                </Button>
            </Footer>
            {currentPick != 0 && isMobile && 
            <>
            <Sticky>
                <DraftMenu />
            </Sticky>
            <SlideScreenMobile />
            </>}
        </Container>
    )
}

export default DraftPicksContainer;

const Container = styled.div`
    width: ${isMobile ? '100%' : '80vw'};
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
    column-gap: 1.3rem;
`
const Footer = styled.div`

`