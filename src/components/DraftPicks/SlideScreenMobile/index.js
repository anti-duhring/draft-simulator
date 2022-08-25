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
import {useSwipeable} from 'react-swipeable'

const SlideScreenMobile = (props) => {
    const {
        isMyPick,
        currentPick
    } = useContext(DraftContext)
    const [currentTeam, allOtherTeams] = useCurrentTeam(1)

    const [tabToShow, setTabToShow] = useState(isMyPick() ? 'pick' : 'trade');
    const [activeIndex, setActiveIndex] = useState(0);
    const [showScreen, setShowScreen] = useState(false);

    const toggleShowScreen = () => {
        setShowScreen(showScreen ? false : true);
    }

    const swipeLeft = () => {
        const maxIndex = isMyPick()? 2 : 1;
        if(activeIndex < maxIndex) {
            setActiveIndex(prevIndex => prevIndex + 1)
        }
    }

    const swipeRight = () => {
        if(activeIndex >= 1) {
            setActiveIndex(prevIndex => prevIndex - 1)
        }
    }

    const handlers = useSwipeable({
        //onSwiped: (eventData) => console.log("User Swiped!", eventData),
        onSwipedLeft: swipeLeft,
        onSwipedRight: swipeRight,
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true,
        trackTouch: true,
        delta: 20,
      });

    useEffect(() => {
        setTabToShow(isMyPick() ? 'pick' : 'trade')
    },[isMyPick])

    return ( 
        <Container>
            <TitleTab isMyPick={isMyPick()} onClick={toggleShowScreen}>
                <IconContext.Provider value={{color: 'white',size:'1.5rem',style: { verticalAlign: 'middle' }}}>
                    Pick {currentPick} - 
                    {isMyPick() ? ' Você está On the Clock' : ` Negocie com o ${currentTeam?.nflData.team_nick}`} {showScreen ? <GoChevronDown /> : <GoChevronUp />}
                </IconContext.Provider>   
            </TitleTab>
            <ContentTab 
                {...handlers}
                style={{display:'flex',height:showScreen ? '80vh' : '0'}}
            >
                <TabLinkContainer>
                    {isMyPick() && 
                    <TabLink 
                        onClick={() => setActiveIndex(0)}
                        isActive={tabToShow == 'pick'}
                        index={0}
                        activeIndex={activeIndex}
                    >
                        Draftar jogador
                    </TabLink>}
                    <TabLink 
                        onClick={() => setActiveIndex(isMyPick() ? 1 : 0)}
                        isActive={tabToShow == 'trade'}
                        index={isMyPick() ? 1 : 0}
                        activeIndex={activeIndex}
                    >
                        Propor troca
                    </TabLink>
                    <TabLink 
                        onClick={() => setActiveIndex(isMyPick() ? 2 : 1)}
                        isActive={tabToShow == 'team'}
                        index={isMyPick() ? 2 : 1}
                        activeIndex={activeIndex}
                    >
                        Time
                    </TabLink>
                </TabLinkContainer>
                <SwipeContainer style={{width: `${isMyPick() ? '300' : '200'}vw`,transform:`translateX(-${activeIndex * (isMyPick() ? 33.33 : 50)}%)`}}>
                    {isMyPick() && 
                    <Inner>
                        <PicksAvaliable toggleShowScreen={toggleShowScreen} />
                    </Inner>}
                    <Inner>
                        <TradeScreen />
                    </Inner>
                    <Inner>
                        <TeamInfo isShow={activeIndex == (isMyPick() ? 2 : 1)} />
                    </Inner>
                    
                </SwipeContainer>
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
    transition: height 1s;
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
    border-bottom: 1px solid ${props.index == props.activeIndex ? ORANGE : 'white'};
    color: ${props.index == props.activeIndex ? ORANGE : DARK_BLACK};
`)
const Inner = styled.div`
    flex: 1;
    overflow-y: auto;
`
const SwipeContainer = styled.div`
    display: flex;
    overflow-y: auto;
    transition: transform .3s;
`