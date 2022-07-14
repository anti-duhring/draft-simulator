import { useState } from "react"
import styled, { css } from "styled-components"
import { BLACK, BORDER_GRAY, GRAY, ORANGE } from "../../../constants/Colors"
import teams from '../../../data/NFL_teams.json'
import './style.css'

const DraftList = (props) => {
    const [currentPick, setCurrentPick] = useState(1);

    const PickItem = ({team, pick}) => {
        const currentTeam = teams.filter(item => item.team_abbr == team.abbreviation)[0];

        return (
            <PickItemContainer otc={currentPick==pick}>
                <Pick>
                    <span className="pick-legend">Pick</span>
                    <span className="pick-number">{pick}</span>
                </Pick>
                <Team>
                    <Logo src={currentTeam.team_logo_espn} />
                    <Status className="pick-status" otc={currentPick==pick}>
                    {currentPick==pick ? 'On the clock' : 'Aguardando'}
                    </Status>
                </Team>
            </PickItemContainer>
        )
    }

    return (
        <Container>
            {props.draftOrder &&
                props.draftOrder.map((team, index) => {
                    return (
                        <PickItem key={index} team={team} pick={index+1} />
                    )
                })
            }
        </Container>
    )
}

export default DraftList;

const Container = styled.div`
    
`

const PickItemContainer = styled.div((props) => css`
    display: flex;
    background-color: white;
    border: 1px solid ${props.otc ? ORANGE : BORDER_GRAY};
    box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 5px;
    height: 3rem;
    align-items: center;
    color: ${GRAY};
    margin-bottom: .5rem;
    margin-left: .5rem;
    margin-right: .5rem;
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