import { useState, useContext, useEffect } from "react";
import Button from "../../components/Button";
import styled from "styled-components";
import DraftList from "../../components/DraftPicks/DraftList";
import DraftMenu from "../../components/DraftPicks/DraftMenu";
import SlideScreenMobile from "../../components/DraftPicks/SlideScreenMobile";
import data from '../../data/players.json'
import { DraftContext } from "../../context/DraftContext";
import { isMobile } from "react-device-detect";
import ActionScreenDesktop from "../../components/DraftPicks/ActionScreenDesktop/Container";
import { useNavigate } from "react-router-dom";

//console.log(data.players.map(item => item.id));

const DraftPicks = (props) => {
    data.players.sort((a, b) => a.pff_rank - b.pff_rank);
    const {
        step, 
        setStep,
        currentPick,
        allPicks
    } = useContext(DraftContext);
    let navigate = useNavigate();
    

    const backToDraftOrder = () => {
        setStep('order');
    }

    useEffect(() => {
        if(!allPicks) {
            navigate('/'); 
        }
    },[])

    if(!allPicks) {
        return <div>Você será redirecionado...</div>
    }


    return (
        <Container>
            <Flex>
                <DraftList />
                {!isMobile && <ActionScreenDesktop />}
            </Flex>
            <Footer>
                <Button disabled={currentPick != 0} onClick={() => navigate('/myDraft')}>
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

export default DraftPicks;

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