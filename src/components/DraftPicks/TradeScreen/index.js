import Select from 'react-select'
import styled from "styled-components";
import data from '../../../data/draft_picks.json'
import teamsData from '../../../data/NFL_teams.json'

const TradeScreen = (props) => {
    const myTeams = data.teams.filter(team => props.myTeams.indexOf(team.franchise_id)!=-1);

    const options = myTeams.map(team => {
        const teamData = teamsData.find(item => item.team_abbr==team.abbreviation)
        const teamNextPick = props.draftOrder.findIndex(item => item.id == team.id)

        return {value: team.id, label:(
        <Option>
            <OptionLogo src={teamData.team_logo_espn} /> <OptionName>{team.nickname}</OptionName>
            <OptionPick>Próxima pick: {teamNextPick + 1}</OptionPick>
        </Option>
        ) }
    });

    const handleSelect = (newValue, actionMeta) => {
        const picks = data.draft_picks.filter(pick => pick.draft_franchise_id == newValue.value && pick.round > 1)

        console.log(picks);
        
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
                
            </OtherTeam>
        </Container>
     );
}
 
export default TradeScreen;

const Container = styled.div`
    padding: 0.5rem;
`
const OtherTeam = styled.div`

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