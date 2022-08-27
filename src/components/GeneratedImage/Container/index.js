import { useState } from "react";
import styled, {css} from "styled-components";
import { BORDER_GRAY, DARK_BLACK, GRAY, LIGHT_ORANGE, ORANGE } from "../../../constants/Colors";
import { isMobile } from "react-device-detect";
import { useAllTeams } from "../../../hooks/useAllTeams";

const Container = (props) => {
    const [tabToShow, setTabToShow] = useState(1);
    const allTeams = props.allTeams;

    const PickItem = ({pick, team}) => {
        return (
            <PickItemContainer>
                <Pick>
                    <span>{pick.pick}</span>
                </Pick>
                <div className="logo-container">
                    <Logo src={`/${team.nflData.team_abbr}.png`} />
                </div>
                <div className="player-container">
                    <PlayerName>
                        <span>{pick.player_picked.name}</span>
                    </PlayerName>
                    <PlayerInfo>
                        <span>{pick.player_picked.position} - {pick.player_picked.college}</span>
                    </PlayerInfo>
                </div>
            </PickItemContainer>
        )
    }

    const PicksList = ({round}) => {
        return (
            <div>
                <TitleGray>
                    <span>Round {round}</span>
                </TitleGray>
                <Body>
                    {
                        props.allPicks[round].map((item, index) => {
                            const team = allTeams.find(i => i.id == item.current_team_id)
                            console.log(item);
                            return (
                                <PickItem
                                    team={team}
                                    pick={item}
                                />
                            )
                        })
                    }
                </Body>
            </div>
        )
    }

    return ( 
        <Wrap>
            <Title>
                <span>{props.title}</span>
            </Title>
            <TabContainer>
                <Tab 
                    isActive={tabToShow == 1}
                    onClick={() => setTabToShow(1)}
                >
                    <span>Round 1</span>
                </Tab>
                <Tab 
                    isActive={tabToShow == 2}
                    onClick={() => setTabToShow(2)}
                >
                    <span>Todas as picks</span>
                </Tab>
            </TabContainer>
            <Body>
                <TabContent index={1} isActive={tabToShow == 1}>
                    {!props.isLoading &&
                        <div className="tab-content-flex">
                            <span>Clique na imagem para baixar</span>
                        </div>
                    }
                    <div className="tab-content-flex">{props.children}</div>
                </TabContent>
                <TabContent index={2} isActive={tabToShow == 2}>
                    {props.rounds == 1 ?
                        <PicksList round={1} /> :
                        <>
                            <PicksList round={1} />
                            <PicksList round={2} />
                        </>
                    }
                </TabContent>
            </Body>
        </Wrap>
     );
}
 
export default Container;

const Wrap = styled.div`
    width: ${isMobile ? '95vw' : '40vw'};
`
const Body = styled.div`
    border: 1px solid ${BORDER_GRAY};
    padding: 0.5rem;
    border-radius: 0 0 5px 5px;
    border-top: none;
`
const Title = styled.div`
    background-color: ${DARK_BLACK};
    border-radius: 5px 5px 0 0;
    padding: 0.5rem;

    span {
        color: white;
    }
`
const TitleGray = styled.div`
    background-color: ${BORDER_GRAY};
    border-radius: 5px 5px 0 0;
    padding: 0.5rem;

    span {
        color: ${GRAY};
    }
`
const TabContainer = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid ${BORDER_GRAY};
    border-top: none;
    border-bottom: none;
`
const Tab = styled.div((props) => css`
    flex: 1;
    border-bottom: 1px solid ${props.isActive? ORANGE : LIGHT_ORANGE};
    cursor: pointer;
    color: ${props.isActive? ORANGE : DARK_BLACK};
    padding: .3rem 0 .3rem 0;

    &:hover {
        border-color: ${ORANGE};
        color: ${ORANGE};
    }
`)
const TabContent = styled.div((props) => css`
    display: ${props.isActive? 'flex' : 'none'};
    flex-direction: column;
    row-gap: .5rem;
`)
const Logo = styled.img`
    width: 2rem;
    height: 2rem;
`
const PickItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    border: 1px solid ${BORDER_GRAY};
    border-radius: 5px;

    .logo-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .player-container {
        flex: 5;
        padding: 0.3rem;
    }
`
const Pick = styled.div`
    flex: 1;
    span {
        font-size: 1.3rem;
        font-weight: bold;
    }
`
const PlayerName = styled.div``
const PlayerInfo = styled.div`
    span {
        font-size: .8rem;
        color: ${GRAY};
    }
`