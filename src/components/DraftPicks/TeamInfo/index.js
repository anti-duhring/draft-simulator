import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { BORDER_GRAY, DARK_BLACK, GRAY } from '../../../constants/Colors';
import {useCurrentTeam} from '../../../hooks/useCurrentTeam'
import { IconContext } from "react-icons";
import { GoSync, GoArrowBoth } from 'react-icons/go'
import ContentLoader from 'react-content-loader'
import { isMobile } from 'react-device-detect';

const TeamInfo = () => {
    const [currentTeam, allOtherTeams] = useCurrentTeam(1);

    const Slice = () => {
        return (
            <SliceContainer>
            <IconContext.Provider value={{color: BORDER_GRAY,size:'1.3rem',style: { backgroundColor:'white', zIndex:'99'}}}>
                <Line />
                <GoArrowBoth />
            </IconContext.Provider>
        </SliceContainer>
        )
    }

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

    const TradeMove = (props) => {
        return (
            <TradeMoveContainer>
                <Title>{props.title}</Title>
                {props.move.map((item, index) => {
                    if(item.player_id) {
                        return (<div key={index}>
                                {item.player_name} - {item.position}
                        </div>)
                    } else {
                        return (
                            <div key={index}>
                                {item.pick ? <>Pick {item.pick} de {item.season} </> :
                                <>Pick round {item.round} de {item.season} </>}
                            </div>
                        )
                    }
                })}
            </TradeMoveContainer>
        )
    }

    const TradeHistory = ({trade}) => {
        const received = trade.assets_received_1.current_owner == currentTeam.id ? trade.assets_received_1.assets : trade.assets_received_2.assets;
        const given = trade.assets_received_1.prev_owner == currentTeam.id ? trade.assets_received_1.assets : trade.assets_received_2.assets;
        const otherTeam = [currentTeam,...allOtherTeams].find(team => team.id==trade.teams_involved.find(i => i!=currentTeam.id));

        return (
            <TradeHistoryContainer> 
                <Title>Troca com {otherTeam.team_name}</Title>
                <TradeMoves>
                    <TradeMove move={received} title='Recebido' />
                    <Slice />
                    <TradeMove move={given} title='Entregue' />
                </TradeMoves>
            </TradeHistoryContainer>
        )
    }

    const Skeleton = () => {
       return (
            <ContentLoader 
            speed={2}
            width={500}
            height={400}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{float: 'left'}}
          >
            <rect x="7" y="101" rx="5" ry="5" width="100" height="20" /> 
            <rect x="40" y="131" rx="5" ry="5" width="220" height="20" /> 
            <rect x="7" y="161" rx="5" ry="5" width="200" height="20" /> 
            <rect x="40" y={191} rx="5" ry="5" width="70" height="20" /> 
            <rect x="40" y="221" rx="5" ry="5" width="200" height="20" /> 
            <rect x="40" y="251" rx="5" ry="5" width="200" height="20" /> 
            <rect x="40" y="281" rx="5" ry="5" width="200" height="20" /> 
            <rect x="40" y={311} rx="5" ry="5" width="70" height="20" /> 
            <rect x="40" y="341" rx="5" ry="5" width="200" height="20" /> 
            <rect x="40" y="371" rx="5" ry="5" width="200" height="20" /> 
            <rect x="40" y="401" rx="5" ry="5" width="200" height="20" /> 
            <rect x="150" y="6" rx="6" ry="6" width="275" height="82" />
          </ContentLoader>
        )
    }

    if(!currentTeam) {
        return (
            <Skeleton />
        )
    }
    return ( 
        <Container>
            <Header>
                {/*<Logo src={currentTeam.nflData.team_logo_espn} />
                <WordMark src={currentTeam.nflData.team_wordmark} />*/}

            </Header>
            <Needs>
                <Title>
                    Needs <div className='length'>{currentTeam.draftNeeds?.length}</div>
                </Title>
                <div className="needs-list">
                    {
                        currentTeam.draftNeeds?.map(item => item).join(', ')
                    }
                </div>
            </Needs>
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
                    currentTeam.tradeHistory.length > 0 ?
                    currentTeam.tradeHistory.map((trade, index) => {
                        return (
                            <TradeHistory key={index} trade={trade} />
                        )
                    }) :
                    <div style={{textAlign:'left'}}>Nenhuma troca</div>
                }
            </History>
        </Container>
     );
}
 
export default TeamInfo;

const Container = styled.div`
    width: ${isMobile? '100vw' : '100%'};
    padding-top: .5rem;
    overflow: auto;
    height: ${isMobile ? 'auto' : '82vh'};
    /*&::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	    border-radius: 10px;
	    background-color: #F5F5F5;
    }
    &::-webkit-scrollbar {
        width: 12px;
	    background-color: #F5F5F5;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
	    background-color: ${DARK_BLACK};
    }*/
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
    margin-top: .5rem;
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
    margin-top: 1rem;
`
const TradeHistoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    align-items: center;
    margin-bottom: .5rem;
    padding: .5rem;
    align-items: flex-start;
    border: 1px solid ${BORDER_GRAY};
    box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 5px;
    
`
const TradeMoves = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    //align-items: flex-start;
    width: 100%;
    margin-top: .5rem;
`
const TradeMoveContainer = styled.div`
    flex: 4;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 0 .5rem 0 0;
`
const SliceContainer = styled.div`
    position: relative;
    flex: 1;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
`
const Line = styled.div`
    height: 100%;
    background-color: ${BORDER_GRAY};
    width: 2px;
    position: absolute;
    left: 50%;
`
const Needs = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 .5rem 0 .5rem;
    align-items: flex-start;
    .needs-list {
        text-indent: 1rem;
    }
`