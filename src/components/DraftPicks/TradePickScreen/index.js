import { useState } from "react";
import styled from "styled-components";
import { IconContext } from "react-icons/lib";
import { GoChevronUp, GoChevronDown } from 'react-icons/go'
import PicksTab from "../PicksTab";

const TradePickScreenMobile = (props) => {
    const MyPicks = props.draftOrder.map((team, index) => { 
        if(props.myTeams.indexOf(team.id) != -1) {
            return index + 1
        }
        return null
    }).filter(team => team != null);
    const isMyPick = MyPicks.indexOf(props.currentPick)!= -1;

    const [showScreen, setShowScreen] = useState(false);
    const [tab, setTab] = useState(isMyPick ? 'pick' : 'trade')

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
                <PicksTab />
            </ContentTab>
        </Container>
     );
}
 
export default TradePickScreenMobile;

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
`
const ContentTab = styled.div`
    background-color: white;
    height: 90vh;
`