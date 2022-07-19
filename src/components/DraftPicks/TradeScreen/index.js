import styled from "styled-components";
import data from '../../../data/draft_picks.json'

const TradeScreen = (props) => {
    return ( 
        <Container>
            <OtherTeam>
                Selecione um dos seus times para compor a troca:
                {
                    data.teams.map(team => {
                        if(props.myTeams.indexOf(team.franchise_id)==-1) return

                        return (
                            <div key={team.franchise_id}>
                                {team.nickname}
                            </div>
                        )
                    })
                }
            </OtherTeam>
        </Container>
     );
}
 
export default TradeScreen;

const Container = styled.div`

`
const OtherTeam = styled.div`

`