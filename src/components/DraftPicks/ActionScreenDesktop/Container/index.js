import { useContext, useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { BLACK, BORDER_GRAY, DARK_BLACK, GRAY, LIGHT_ORANGE, ORANGE } from "../../../../constants/Colors";
import { DraftContext } from '../../../../Context/DraftContext'
import { useCurrentTeam } from "../../../../hooks/useCurrentTeam";
import Button from "../../../Button";
import PicksAvaliable from "../../PicksAvaliable";
import TeamInfo from "../../TeamInfo";
import TradeScreen from '../../TradeScreen'

const ActionScreenDesktop = () => {
    const {
        isMyPick,
        handleNextPick,
        handleMyNextPick,
        currentPick,
        allPicks,
        MyPicks,
        isJumpingTo
    } = useContext(DraftContext);
    const currentTeam = useCurrentTeam(1);

    const [tabToShow, setTabToShow] = useState(isMyPick() ? 'pick' : 'trade');

    const toggleShowScreen = () => {

    }

    useEffect(() => {
        setTabToShow(isMyPick() ? 'pick' : 'trade')
    },[isMyPick])

    return ( 
        <Container>
            <Header isMyPick={isMyPick()}>Painel do GM - {isMyPick() ? 'Sua pick' : `Negocie com o ${currentTeam?.nflData.team_nick}`}</Header>
            <Content>
            <TabLinkContainer>
                <Tabs>
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
                </Tabs>
                    <TabActions>
                    <Button 
                        disabled={MyPicks().indexOf(currentPick)!= -1 || isJumpingTo}
                        style={ButtonStyle} 
                        onClick={handleNextPick}
                    >
                        Próxima pick
                    </Button>
                
                
                    <Button 
                    disabled={MyPicks().indexOf(currentPick)!= -1 || isJumpingTo}
                    style={ButtonStyle} 
                    onClick={handleMyNextPick}
                    >
                        
                        {MyPicks().find(pick => pick > currentPick && pick < 32) ? `Pular até a pick ${MyPicks().find(pick => pick > currentPick && pick < 32)}` : 'Pular até o final'}
                    </Button>
                    
                </TabActions>
            </TabLinkContainer>
                    {tabToShow == 'trade' && currentPick > 0 && <TradeScreen />}
                    {tabToShow == 'team' && currentPick > 0 && <TeamInfo />}
                    {tabToShow == 'pick' && currentPick > 0 && <PicksAvaliable toggleShowScreen={toggleShowScreen} />}
                    {currentPick == 0 && 
                        <div>
                            Draft finalizado!!
                        </div>
                    }
            </Content>
        </Container>
     );
}
 
export default ActionScreenDesktop;

const Container = styled.div`
    flex: 1.5;
    width: 40rem;
    height: fit-content;
    position: sticky;
    top: 5px;
`
const Header = styled.div((props) =>  css`
    background-color: ${props.isMyPick? ORANGE : DARK_BLACK};
    border-radius: 5px 5px 0 0;
    color: white;
    width: 100%;
    padding: .3rem 0 .3rem 0;
`)
const Content = styled.div`
    border: 1px solid ${BORDER_GRAY};
    box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 0 0 5px 5px;
    height: auto;
    overflow: auto;
    //font-size: .8rem;
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
    color: ${props.isActive ? ORANGE : DARK_BLACK};
    font-size: .8rem;
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        color: ${ORANGE};
        border-color: ${props.isActive ? ORANGE : LIGHT_ORANGE};
    }
`)
const Tabs = styled.div`
    flex:2;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const TabActions = styled.div`
    flex:1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    column-gap: .3rem;
    padding-right: .3rem;
`
const ButtonStyle = {
    height:30,
    lineHeight:'32px', 
    paddingLeft:15, 
    paddingRight:15,
    fontSize: 8,
    borderRadius:5
}