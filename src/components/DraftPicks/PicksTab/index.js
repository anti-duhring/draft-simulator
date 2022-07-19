import data from '../../../data/players.json'
import styled from "styled-components";

const PicksTab = (props) => {
    const playersAvaliable = data.players.filter(item => props.picksPlayers.indexOf(item.id)==-1);

    return ( 
        <Container>
           {
            playersAvaliable.map((player, index) => {
                return (
                    <div key={index}>
                        {player.name}
                    </div>
                )
            })
           }
        </Container>
     );
}
 
export default PicksTab;

const Container = styled.div`

`