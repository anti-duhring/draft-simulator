import { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons/lib";
import { GoChevronUp, GoChevronDown } from 'react-icons/go'
import PicksAvaliable from "../PicksAvaliable";

const SlideScreenMobile = (props) => {
    const MyPicks = props.draftOrder.map((team, index) => { 
        if(props.myTeams.indexOf(team.id) != -1) {
            return index + 1
        }
        return null
    }).filter(team => team != null);
    const isMyPick = MyPicks.indexOf(props.currentPick)!= -1;

    const [showScreen, setShowScreen] = useState(false);

    const toggleShowScreen = () => {
        setShowScreen(showScreen ? false : true);
    }

    return ( 
        <Container>
            <TitleTab onClick={toggleShowScreen}>
                <IconContext.Provider value={{color: 'white',size:'1.5rem',style: { verticalAlign: 'middle' }}}>
                    {isMyPick ? 'Fazer pick' : 'Oferecer troca'} {showScreen ? <GoChevronDown /> : <GoChevronUp />}
                </IconContext.Provider>   
            </TitleTab>
            <ContentTab style={{display:showScreen ? 'flex' : 'none'}}>
                {isMyPick ? 
                    <PicksAvaliable 
                        picksPlayers={props.picksPlayers}
                        //setPicksPlayers={props.setPicksPlayers}
                        //currentPick={props.currentPick} 
                        //setCurrentPick={props.setCurrentPick} 
                        toggleShowScreen={toggleShowScreen}
                        handleDraftPlayer={props.handleDraftPlayer}
                    /> 
                : 'trade'}
            </ContentTab>
        </Container>
     );
}
 
export default SlideScreenMobile;

const Container = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
`
const TitleTab = styled.div`
    background-color: black;
    height: 2rem;
    color: white;   
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`
const ContentTab = styled.div`
    background-color: white;
    height: 80vh;
    padding: .5rem;
    /*overflow: auto;*/
`