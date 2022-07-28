import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { BORDER_GRAY } from '../../../constants/Colors';
import {useCurrentTeam} from '../../../hooks/useCurrentTeam'

const TeamInfo = () => {
    const currentTeam = useCurrentTeam(1);
    console.log(currentTeam);

    /*useEffect(() => {
        if(!currentTeam) return
        console.log(currentTeam.tradablePlayers.map(p => p.position).filter((p, i) => currentTeam.tradablePlayers.map(p => p.position).indexOf(p)==i));
        
    },[currentTeam])*/

    const Player = ({player}) => {
        return (
            <PlayerContainer>
                <PlayerName>{player.player_name}</PlayerName>
                <PlayerPosition></PlayerPosition>
            </PlayerContainer>
        )
    }
    const PlayerListByPosition = ({position}) => {
        return (
            <PlayerList>
                <Title>{position}</Title>
                {
                    currentTeam.tradablePlayers.filter(i => i.position==position).map((player, index) => {
                        return (
                            <Player key={index} player={player} />
                        )
                    })
                }
            </PlayerList>
        )
    }

    if(!currentTeam) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    return ( 
        <Container>
            <Header>
                <Logo src={currentTeam.nflData.team_logo_espn} />
                <WordMark src={currentTeam.nflData.team_wordmark} />
                {/*<NameTeam>
                    {currentTeam.nflData.team_name}
                    {currentTeam.nflData.team_division}
    </NameTeam>*/}
            </Header>
            <Players>
                <Title>
                    Jogadores trocáveis <div className='length'>{currentTeam.tradablePlayers.length}</div>
                </Title>
                {
                    currentTeam.tradablePlayers.map(p => p.position).filter((p, i) => currentTeam.tradablePlayers.map(p => p.position).indexOf(p)==i).map((position, index) => {
                        return (
                            <PlayerListByPosition position={position} key={index} />
                        )
                    })
                }
            </Players>
            <History>
                <Title>
                    Histórico de trocas
                </Title>
                {
                    currentTeam.tradeHistory.map(trade => {
                        const received = trade.assets_received_1.current_owner == currentTeam.id ? trade.assets_received_1.assets : trade.assets_received_2.assets;
                        const given = trade.assets_received_1.prev_owner == currentTeam.id ? trade.assets_received_1.assets : trade.assets_received_2.assets;

                        return (
                            <div>
                                <div>
                                    <Title>Recebido</Title>
                                    {received.map(item => {
                                        if(item.player_id) {
                                            return (<div>
                                                 {item.player_name}
                                            </div>)
                                        } else {
                                            return (
                                                <div>
                                                    pick round {item.round} de {item.season} 
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                                <div>
                                    <Title>Dado</Title>
                                    {given.map(item => {
                                                                                                if(item.player_id) {
                                            return (<div>
                                                 {item.player_name}
                                            </div>)
                                        } else {
                                            return (
                                                <div>
                                                    pick round {item.round} de {item.season} 
                                                </div>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        )
                    })
                }
            </History>
        </Container>
     );
}
 
export default TeamInfo;

const Container = styled.div`
    width: 100%;
    padding-top: .5rem;
    overflow: auto;
`
const Logo = styled.img`
    width: 5rem;
`
const WordMark = styled.img`
    height: 3rem;
`
const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: .5rem 0 .5rem 0 ;
`
const Players = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 .5rem 0 .5rem;
    align-items: flex-start;
`
const Title = styled.div`
    font-weight: bold;
    display: flex;
    align-items: center;
    & .length {
        font-size: .7rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: normal;
        background-color: ${BORDER_GRAY};
        padding: 3px 5px;
        border-radius: 50%;
        margin: 0 0 0 .5rem;
    }
`
const PlayerList = styled.div`
    margin-top: .5rem;
`
const PlayerContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const PlayerName = styled.div`
    text-indent: 1rem;
`
const PlayerPosition = styled.div`

`
const History = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 .5rem 0 .5rem;
    margin-top: .5rem;
`