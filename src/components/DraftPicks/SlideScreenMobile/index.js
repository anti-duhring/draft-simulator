import { useState, useContext, useEffect } from "react";
import styled, { css } from "styled-components";
import { IconContext } from "react-icons/lib";
import { GoChevronUp, GoChevronDown } from 'react-icons/go'
import PicksAvaliable from "../PicksAvaliable";
import TradeScreen from '../TradeScreen'
import { DraftContext } from "../../../Context/DraftContext";
import { DARK_BLACK, ORANGE } from "../../../constants/Colors";
import TeamInfo from "../TeamInfo";
import { useCurrentTeam } from "../../../hooks/useCurrentTeam";

const SlideScreenMobile = (props) => {
    const {
        isMyPick
    } = useContext(DraftContext)
    const [currentTeam, allOtherTeams] = useCurrentTeam(1)

    const [tabToShow, setTabToShow] = useState(isMyPick() ? 'pick' : 'trade');
    const [showScreen, setShowScreen] = useState(false);

    const toggleShowScreen = () => {
        setShowScreen(showScreen ? false : true);
    }

    useEffect(() => {
        setTabToShow(isMyPick() ? 'pick' : 'trade')
    },[isMyPick])

    return ( 
        <Container>
            <TitleTab isMyPick={isMyPick()} onClick={toggleShowScreen}>
                <IconContext.Provider value={{color: 'white',size:'1.5rem',style: { verticalAlign: 'middle' }}}>
                    {isMyPick() ? 'Você está On the Clock' : `Negocie com o ${currentTeam?.nflData.team_nick}`} {showScreen ? <GoChevronDown /> : <GoChevronUp />}
                </IconContext.Provider>   
            </TitleTab>
            <ContentTab style={{display:'flex',height:showScreen ? '80vh' : '0'}}>
                <TabLinkContainer>
                    {isMyPick() && <TabLink 
                        onClick={() => setTabToShow('pick')}
                        isActive={tabToShow == 'pick'}
                    >
                        Draftar jogador
                    </TabLink>}
                    <TabLink 
                        onClick={() => setTabToShow('trade')}
                        isActive={tabToShow == 'trade'}
                    >
                        Propor troca
                    </TabLink>
                    <TabLink 
                        onClick={() => setTabToShow('team')}
                        isActive={tabToShow == 'team'}
                    >
                        Time
                    </TabLink>
                </TabLinkContainer>

                {tabToShow == 'pick' &&
                <PicksAvaliable toggleShowScreen={toggleShowScreen} />}
                {tabToShow == 'trade' &&
                <TradeScreen />}
                {tabToShow == 'team' &&
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
    margin-bottom: -1px;
`
const TitleTab = styled.div((props) => css`
    background-color: ${props.isMyPick ? ORANGE : DARK_BLACK};
    height: 2rem;
    color: white;   
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    cursor: pointer;
`)
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