import { useState, useContext } from "react";
import styled, { css } from "styled-components";
import { IconContext } from "react-icons/lib";
import { GoChevronUp, GoChevronDown } from 'react-icons/go'
import PicksAvaliable from "../PicksAvaliable";
import TradeScreen from '../TradeScreen'
import { DraftContext } from "../../../Context/DraftContext";
import { ORANGE } from "../../../constants/Colors";
import TeamInfo from "../TeamInfo";

const SlideScreenMobile = (props) => {
    const {MyPicks, currentPick} = useContext(DraftContext)
    const isMyPick = MyPicks().indexOf(currentPick)!= -1;

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
            <ContentTab style={{display:'flex',height:showScreen ? '80vh' : '0'}}>
                <TabLinkContainer>
                    <TabLink 
                        onClick={() => props.setTabToShow('pick')}
                        isActive={props.tabToShow == 'pick'}
                    >
                        Draftar jogador
                    </TabLink>
                    <TabLink 
                        onClick={() => props.setTabToShow('trade')}
                        isActive={props.tabToShow == 'trade'}
                    >
                        Propor troca
                    </TabLink>
                    <TabLink 
                        onClick={() => props.setTabToShow('team')}
                        isActive={props.tabToShow == 'team'}
                    >
                        Time
                    </TabLink>
                </TabLinkContainer>

                {props.tabToShow == 'pick' &&
                <PicksAvaliable toggleShowScreen={toggleShowScreen} />}
                {props.tabToShow == 'trade' &&
                <TradeScreen />}
                {props.tabToShow == 'team' &&
                <TeamInfo />}
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
    cursor: pointer;
`
const ContentTab = styled.div`
    background-color: white;
    transition: height .5s;
    //height: 80vh;
    padding: 0;//.5rem;
    /*overflow: auto;*/
    display: flex;
    flex-direction: column;
`
const TabLinkContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const TabLink = styled.div((props) => css`
    flex: 1;
    padding: .5rem 0 .5rem 0;
    border-bottom: 1px solid ${props.isActive ? ORANGE : 'white'};
`)