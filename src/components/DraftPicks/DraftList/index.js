import { useEffect, useContext, useState } from "react"
import styled, { css } from "styled-components"
import { BLACK, BORDER_GRAY, DARK_BLACK, GRAY, LIGHT_ORANGE, ORANGE } from "../../../constants/Colors"
import teams from '../../../data/NFL_teams.json'
import './style.css'
import { isMobile } from "react-device-detect"
import {DraftContext} from '../../../Context/DraftContext'

const DraftList = (props) => {
    const {
        currentPick,
        picksPlayers,
        myTeams,
        allPicks,
        rounds
    } = useContext(DraftContext);
    const [round, setRound] = useState(1)

    const PickItem = ({team, pick, index}) => {
        const currentTeam = teams.find(item => item.team_id == team);

        return (
            <PickItemContainer className={`pick-${pick.pick}`} otc={currentPick==pick.pick} isMyPick={myTeams.indexOf(team) != -1}>
                <Pick>
                    <span className="pick-legend">Pick</span>
                    <span className="pick-number">{pick.pick}</span>
                </Pick>
                <Team>
                    <Logo src={currentTeam.team_logo_espn} />
                    <Status className="pick-status" otc={currentPick==pick.pick}>
                    {currentPick==pick.pick ? 'On the Clock' : pick.player_picked ? `${pick.player_picked.name} - ${pick.player_picked.position}` : 'Aguardando...'}
                    </Status>
                </Team>
            </PickItemContainer>
        )
    }

    return (
        <Container>
            {!isMobile && rounds > 1 && <TabRounds>
                <TabRoundItem 
                    onClick={() => setRound(1)}
                    isActive={round==1}
                    round={1}
                >Round 1</TabRoundItem>
                <TabRoundItem 
                    onClick={() => setRound(2)}
                    isActive={round==2}
                    round={2}
                >Round 2</TabRoundItem>
            </TabRounds>}
            <AllPicksContainer>
            { !isMobile?
                allPicks[round].map((pick, index) => {
                    return (
                        <PickItem key={index} team={pick.current_team_id} pick={pick} index={index} />
                    )
                }) :
                rounds > 1 ? 
                [...allPicks[1],...allPicks[2]].map((pick, index) => {
                    return (
                        <PickItem key={index} team={pick.current_team_id} pick={pick} index={index} />
                    )
                }) :
                allPicks[1].map((pick, index) => {
                    return (
                        <PickItem key={index} team={pick.current_team_id} pick={pick} index={index} />
                    )
                })
            }
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
    color: white;
    background-color: ${props.isActive ? DARK_BLACK : 'rgba(0,0,0,.2)'};
    border-radius: ${props.round == 1 ? '5px 0 0 5px' : '0 5px 5px 0'};
    cursor: pointer;
    padding: .2rem;
    text-transform: uppercase;
    font-weight: 600;
    transition: .3s;
    font-size: .8rem;
    &:hover {
        background-color: ${ORANGE};
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
    background-color: white;
    border: 1px solid ${props.otc ? ORANGE : BORDER_GRAY};
    border-right: ${props.isMyPick ? `7px solid ${ORANGE}` : ''};
    box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 5px;
    height: 3rem;
    align-items: center;
    color: ${GRAY};
    margin-bottom: .5rem;
    margin-left: .5rem;
    margin-right: .5rem;
    width: ${isMobile ? '95vw' : '100%'};
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

`
const Team = styled.div`
    flex: 4;
    display: flex;
    align-items: center;
`
const Logo = styled.img`
    width: 2rem;
    height: 2rem;
`