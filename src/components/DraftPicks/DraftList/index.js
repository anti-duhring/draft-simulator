import { createRef, useState, useRef, useContext } from "react"
import styled, { css } from "styled-components"
import { BLACK, BORDER_GRAY, GRAY, ORANGE } from "../../../constants/Colors"
import teams from '../../../data/NFL_teams.json'
import data from '../../../data/players.json'
import './style.css'
import { isMobile } from "react-device-detect"
import {DraftContext} from '../../../Context/DraftContext'

const DraftList = (props) => {
    const {
        currentPick,
        picksPlayers,
        myTeams,
        allPicks
    } = useContext(DraftContext);

    const PickItem = ({team, pick, index}) => {
        const currentTeam = teams.find(item => item.team_id == team);
        const playerPick = currentPick > pick ? data.players.find(item => item.id == picksPlayers[index]) : null;

        return (
            <PickItemContainer className={`pick-${pick}`} otc={currentPick==pick} isMyPick={myTeams.indexOf(team) != -1}>
                <Pick>
                    <span className="pick-legend">Pick</span>
                    <span className="pick-number">{pick}</span>
                </Pick>
                <Team>
                    <Logo src={currentTeam.team_logo_espn} />
                    <Status className="pick-status" otc={currentPick==pick}>
                    {currentPick==pick ? 'On the clock' : currentPick > pick ? null : 'Aguardando'}
                    {currentPick > pick && playerPick?.name}
                    </Status>
                </Team>
            </PickItemContainer>
        )
    }

    return (
        <Container>
            {
                allPicks.round1.map((pick, index) => {
                    return (
                        <PickItem key={index} team={pick.current_team_id} pick={pick.pick} index={index} />
                    )
                })
            }
        </Container>
    )
}

export default DraftList;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
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
    width: ${isMobile ? '95%' : '50rem'};
`)
const Status = styled.span((props) => css`
    margin-left: .5rem;
    ${props.otc && `
        font-weight: bold;
    `}
`)
const Pick = styled.div`
    flex: 1;

`
const Team = styled.div`
    flex: 3;
    display: flex;
    align-items: center;
`
const Logo = styled.img`
    width: 2rem;
    height: 2rem;
`