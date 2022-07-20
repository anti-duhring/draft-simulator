import {useState, useContext} from 'react'
import Select from 'react-select'
import styled from "styled-components";
import data from '../../../data/draft_picks.json'
import teamsData from '../../../data/NFL_teams.json'
import {DraftContext} from '../../../Context/DraftContext'

const TradeScreen = (props) => {
    const {
        myTeams,
        draftOrder,
        allPicks,
        currentPick
    } = useContext(DraftContext)
    const [otherTeamPicks, setOtherTeamPicks] = useState(null);

    const myTeamsData = data.teams.filter(team => myTeams.indexOf(team.franchise_id)!=-1);

    const options = myTeamsData.map(team => {
        const teamData = teamsData.find(item => item.team_abbr==team.abbreviation)
        const teamNextPick = draftOrder.findIndex(item => item.id == team.id) + 1

        return {value: team.id, label:(
        <Option>
            <OptionLogo src={teamData.team_logo_espn} /> <OptionName>{team.nickname}</OptionName>
            <OptionPick>Próxima pick: {teamNextPick}</OptionPick>
        </Option>
        ) }
    });

    const handleSelect = (newValue, actionMeta) => {
        const myPicks = [];
        //const myPicks = allPicks.filter(pick => pick.current_team_id == newValue.value)
        Object.entries(allPicks).map(item => {
            const picksFromThisRound = item[1].filter(pick => pick.current_team_id == newValue.value);

            myPicks.push(...picksFromThisRound)
        })

        setOtherTeamPicks(myPicks);
        console.log(myPicks);
        
    }

    
    return ( 
        <Container>
            <OtherTeam>
                Selecione um dos seus times para compor a troca:
                <Select 
                    options={options} 
                    defaultValue={options[0]} 
                    onChange={handleSelect}
                />
                <div>
                    {otherTeamPicks &&
                        otherTeamPicks.map(pick => {
                            return (
                                <div>
                                    Pick {pick.pick} de {pick.season}
                                </div>
                            )
                        })
                    }
                </div>
            </OtherTeam>
            <CurrentTeam>
                <Select 
                    isDisabled={true}
                    defaultValue={{value: 0, label: data.teams.find(item => item.id==allPicks.round1[currentPick - 1].current_team_id).nickname}} 
                />
                <div>
                    {otherTeamPicks &&
                        otherTeamPicks.map(pick => {
                            return (
                                <div>
                                    Pick {pick.pick} de {pick.season}
                                </div>
                            )
                        })
                    }
                </div>
            </CurrentTeam>
        </Container>
     );
}
 
export default TradeScreen;

const Container = styled.div`
    padding: 0.5rem;
`
const OtherTeam = styled.div`

`
const CurrentTeam = styled.div`

`
const OptionLogo = styled.img`
    width: 2rem;
    height: 2rem;
    margin-right: .5rem;
`
const Option = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const OptionName = styled.span`
    font-weight: bold;
`
const OptionPick = styled.span`
    margin-left: .5rem;
`