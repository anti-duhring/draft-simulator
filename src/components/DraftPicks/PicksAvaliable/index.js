import data from '../../../data/players.json'
import styled from "styled-components";
import { BLACK, BORDER_GRAY, GRAY } from '../../../constants/Colors';

const PicksAvaliable = (props) => {
    data.players.sort((a, b) => a.pff_rank - b.pff_rank);
    const playersAvaliable = props.picksPlayers ? data.players.filter(item => props.picksPlayers.indexOf(item.id)==-1) : data.players;

    const handleDraftPlayer = (player) => {
        props.setShowScreen(false);
        props.setCurrentPick(props.currentPick + 1);
        props.setPicksPlayers(prevPicks => prevPicks ? ([...prevPicks,player.id]) : ([player.id]));
    }

    const PlayerItem = ({player}) => {
        return (
            <PlayerContainer onClick={() => handleDraftPlayer(player)}>
                <Rank>
                   Rank <Mark>{player.pff_rank}</Mark>
                </Rank>
                <PlayerName>
                    <Mark>{player.name}</Mark> [{player.position}] - {player.college}
                </PlayerName>
            </PlayerContainer>
        )
    }

    return ( 
        <Container>
           {
            playersAvaliable.map((player, index) => {
                return (
                    <PlayerItem player={player} key={index} />
                )
            })
           }
        </Container>
     );
}
 
export default PicksAvaliable;

const Container = styled.div`
    width: 100%;
`
const PlayerContainer = styled.div`
    display: flex;
    background-color: white;
    border: 1px solid ${BORDER_GRAY};
    box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 5px;
    height: 3rem;
    align-items: center;
    color: ${GRAY};
    margin-bottom: .5rem;
    margin-left: .3rem;
    margin-right: .3rem;
`
const Rank = styled.div`
    flex: 1;
`
const PlayerName = styled.div`
    flex: 3;
`
const Mark = styled.span`
    font-weight: bold;
    color: ${BLACK};
`