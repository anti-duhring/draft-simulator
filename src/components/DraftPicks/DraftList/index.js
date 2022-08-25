import { useEffect, useContext, useState, useRef } from "react"
import styled, { css } from "styled-components"
import { BLACK, BORDER_GRAY, DARK_BLACK, GRAY, LIGHT_ORANGE, ORANGE } from "../../../constants/Colors"
//import teams from '../../../data/NFL_teams.json'
import { isMobile } from "react-device-detect"
import {DraftContext} from '../../../Context/DraftContext';
import {useIntersection} from '../../../hooks/useIntersection'
import {useAllTeams} from '../../../hooks/useAllTeams'
import ContentLoader from 'react-content-loader'
import { IconContext } from "react-icons";
import { FaExchangeAlt } from "react-icons/fa";

const DraftList = (props) => {
    const {
        currentPick,
        myTeams,
        allPicks,
        rounds,
        currentRound,
        setCurrentRound
    } = useContext(DraftContext);
    const allTeams = useAllTeams();
    const round1Ref = useRef();
    const round2Ref = useRef();
    const round1InViewport = useIntersection(round1Ref, '0px');
    let roundPagination = 1;

    if(round1InViewport) {
        roundPagination = 1;
    } else {
        roundPagination = 2;
    }


    const PickItem = ({team, pick, index}) => {
        if(!allTeams)  {
            return (
                <PickItemContainer className={`pick-${pick.pick}`}  isMyPick={myTeams.indexOf(team) != -1}>
                    <ContentLoader 
                        speed={2}
                        width={400}
                        height={50}
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <rect x="10" y="15" rx="5" ry="5" width="70" height="20" /> 
                        <rect x="90" y="15" rx="5" ry="5" width="200" height="20" />
                    </ContentLoader>
                </PickItemContainer>
            )
        }

        const currentTeam = allTeams.find(item => item.id == team);

        return (
            <PickItemContainer className={`pick-${pick.pick}`} otc={currentPick==pick.pick} isMyPick={myTeams.indexOf(team) != -1}>
                <Pick className="pick-container">
                    <span className="pick-legend">Pick</span>
                    <span className="pick-number">{pick.pick}</span>
                </Pick>
                <Team>
                    <Logo src={`/${currentTeam.nflData.team_abbr}.png`} />
                    <Status className="pick-status" otc={currentPick==pick.pick}>
                        {currentPick==pick.pick ? 'On the Clock' : pick.player_picked ? `${pick.player_picked.name} - ${pick.player_picked.position}` : 'Aguardando...'}
                    </Status>
                </Team>
                {pick.original_team_id != pick.current_team_id &&
                    <div className="via-pick">
                        <IconContext.Provider value={{
                             color: currentPick==pick.pick ? 'white' : GRAY, 
                             className: "icon-exchange" 
                        }}>
                            <FaExchangeAlt />
                        </IconContext.Provider>
                         {allTeams.find(item => item.id == pick.original_team_id).nflData.team_abbr}
                    </div>
                }
            </PickItemContainer>
        )
    }

    return (
        <Container>
            {isMobile && rounds > 1 &&
                <RoundPagination>
                    <RoundPaginationLegend>
                        ROUND {roundPagination}
                    </RoundPaginationLegend>
                </RoundPagination>
            }
            {!isMobile && rounds > 1 && <TabRounds>
                <TabRoundItem 
                    onClick={() => setCurrentRound(1)}
                    isActive={currentRound==1}
                    round={1}
                >Round 1</TabRoundItem>
                <TabRoundItem 
                    onClick={() => setCurrentRound(2)}
                    isActive={currentRound==2}
                    round={2}
                >Round 2</TabRoundItem>
            </TabRounds>}
            <AllPicksContainer>
            { !isMobile &&
                allPicks[currentRound].map((pick, index) => {
                    return (
                        <PickItem key={index} team={pick.current_team_id} pick={pick} index={index} />
                    )
                })
            }
            
            <div className="round1" ref={round1Ref}>
                {   isMobile && 
                    allPicks[1].map((pick, index) => {
                        return (
                            <PickItem key={index} team={pick.current_team_id} pick={pick} index={index} />
                        )
                    })
                }
            </div>
            <div className="round2" ref={round2Ref}>
                {   isMobile && rounds > 1 &&
                    allPicks[2].map((pick, index) => {
                        return (
                            <PickItem key={index} team={pick.current_team_id} pick={pick} index={index} />
                        )
                    })
                }
            </div>
                
            </AllPicksContainer>
        </Container>
    )
}

export default DraftList;

const Container = styled.div`
    flex:1;
`
const TabRounds = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: .5rem;
`
const TabRoundItem = styled.div((props) => css`
    flex: 1;
    color: ${props.isActive ? 'white' : DARK_BLACK};
    border: 1px solid ${DARK_BLACK};
    border-left: ${props.round == 1 ? `1px solid ${DARK_BLACK}`: `none`};
    background-color: ${props.isActive ? DARK_BLACK : 'white'};
    border-radius: ${props.round == 1 ? '5px 0 0 5px' : '0 5px 5px 0'};
    cursor: pointer;
    padding: .2rem;
    text-transform: uppercase;
    font-weight: 600;
    transition: .3s;
    font-size: .8rem;
    &:hover {
        background-color: ${props.isActive ? DARK_BLACK : 'rgba(0,0,0,.1)'};
    }
`)
const AllPicksContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex:1;
`

const PickItemContainer = styled.div((props) => css`
    display: flex;
    background-color: ${props.otc? ORANGE : 'white'};
    border: 1px solid ${props.otc ? ORANGE : BORDER_GRAY};
    border-right: ${props.isMyPick ? `7px solid ${ORANGE}` : ''};
    box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 5px;
    height: 3rem;
    align-items: center;
    color: ${props.otc? 'white' : GRAY};
    margin-bottom: .5rem;
    margin-left: .5rem;
    margin-right: .5rem;
    width: ${isMobile ? '95vw' : '100%'};
    .pick-number {
        margin-left: .5rem;
        font-weight: bold;
        color: ${props.otc? 'white' : BLACK} ;
    }
    .pick-container {
        border-color: ${props.otc? 'white' : BORDER_GRAY};
    }
    .via-pick {
        font-size: .7rem;
        margin-right: 1rem;
        display: flex;
        align-content: center;
        align-items: center;
    }
    .icon-exchange {
        margin-right: 0.3rem;
    }
`)
const Status = styled.span((props) => css`
    margin-left: .5rem;
    ${props.otc && `
        font-weight: bold;
    `}
`)
const Pick = styled.div`
    flex: 1;
    border-right: 1px solid ${BORDER_GRAY};
    margin-right: .5rem;
    max-width: 5rem;
    min-width: 5rem;
`
const Team = styled.div`
    flex: 4;
    display: flex;
    align-items: center;
    .watch-cotainer {
        margin-left: 1rem;
    }
`
const Logo = styled.img`
    width: 2rem;
    height: 2rem;
`
const RoundPagination = styled.div`
    position: sticky;
    top: .3rem;
    display: flex;
    justify-content: flex-end;
`
const RoundPaginationLegend = styled.div`
    background-color: ${DARK_BLACK};
    color: white;
    width: 5rem;
    margin: .3rem .6rem .3rem .6rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    font-size: .7rem;
`