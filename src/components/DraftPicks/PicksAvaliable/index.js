import { useState, useEffect, useContext, useRef } from 'react';
import Select from 'react-select'
import data from '../../../data/players.json'
import styled from "styled-components";
import { BLACK, BORDER_GRAY, GRAY } from '../../../constants/Colors';
import { DraftContext } from '../../../Context/DraftContext';
import { isMobile } from 'react-device-detect';
import { defaultStyles, SelectTheme } from '../../../constants/SelectStyles';

const options = [
    { value: 'QB', label: 'QB' },
    { value: 'ED', label: 'ED' },
    { value: 'DI', label: 'DI' },
    { value: 'TE', label: 'TE' },
    { value: 'WR', label: 'WR' },
    { value: 'T', label: 'T' },
    { value: 'CB', label: 'CB' },
    { value: 'G', label: 'G' },
    { value: 'HB', label: 'HB' },
    { value: 'S', label: 'S' },
    { value: 'C', label: 'C' },
  ]

const PicksAvaliable = (props) => {
    const {
        picksPlayers,
        handleDraftPlayer

    } = useContext(DraftContext)

    data.players.sort((a, b) => a.pff_rank - b.pff_rank);
    const [playersAvaliable, setPlayersAvaliable] = useState(data.players.filter(item => picksPlayers.indexOf(item.id)==-1));
    const [searchName, setSearchName] = useState('')
    const [searchPositions, setSearchPositions] = useState([]);
    const [render, setRender] = useState(1);
    const PlayerItemRef = useRef();

    useEffect(() => {
        setRender(render + 1)
        setPlayersAvaliable(data.players.filter(item => picksPlayers.indexOf(item.id)==-1))
    },[picksPlayers])

    const handleSearchName = (e) => {
        setSearchName(e.target.value);

        if(e.target.value && e.target.value != '') {
            setPlayersAvaliable(data.players.filter(item => {
                if(searchPositions.length > 0) {
                    return picksPlayers.indexOf(item.id)==-1 && item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1 && searchPositions.indexOf(item.position) != -1
                } else {
                    return picksPlayers.indexOf(item.id)==-1 && item.name.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1
                }
            }));
        }
        else {
            setPlayersAvaliable(data.players.filter(item => {
                if(searchPositions.length > 0) {
                    return picksPlayers.indexOf(item.id)==-1 && searchPositions.indexOf(item.position) != -1
                } else {
                    return picksPlayers.indexOf(item.id)==-1
                }

            }));
        } 
    }

    const handleSelect = (newValue, actionMeta) => {
        const selected = [];
        newValue.map(item => {
            selected.push(item.value)
        })
        setSearchPositions(selected);
        if(newValue.length > 0) {
            setPlayersAvaliable(data.players.filter(item => {
                return picksPlayers.indexOf(item.id)==-1 && selected.indexOf(item.position) != -1
            }));
        } else {
            setPlayersAvaliable(data.players.filter(item => picksPlayers.indexOf(item.id)==-1));
        }
    }

    const PlayerItem = ({player}) => {
        return (
            <PlayerContainer className={`player-${player.pff_rank}`} onPointerDown={() => {
                document.querySelector(`.player-${player.pff_rank}`).style.backgroundColor = BORDER_GRAY
            }} onPointerUp={() => {
                props.toggleShowScreen();
                handleDraftPlayer(player)
            }}>
                <Rank>
                   Rank <Mark>{player.pff_rank}</Mark>
                </Rank>
                <PlayerName>
                    <Mark>{player.name}</Mark> {player.position} - {player.college}
                </PlayerName>
            </PlayerContainer>
        )
    }

    return ( 
        <Container>
            <SearchContainer>
                <SearchBox>

                    <Select 
                        theme={SelectTheme}
                        styles={defaultStyles}
                        isMulti={true} 
                        options={options} 
                        onChange={handleSelect} 
                        placeholder='Posições' 
                    />
                </SearchBox>
                <SearchBox>
                    <SearchInput type="text" onChange={(e) => handleSearchName(e)} value={searchName} name="search" placeholder={'Pesquisar'} />
                </SearchBox>
            </SearchContainer>
            <PlayersList>
           {
            playersAvaliable.map((player, index) => {
                return (
                    <PlayerItem player={player} key={index} />
                )
            })
           }
           </PlayersList>
        </Container>
     );
}
 
export default PicksAvaliable;

const Container = styled.div`
    width: 100%;
    height: ${isMobile? '100%' : '82vh'};
    //padding-top: 0;
    overflow: auto;
`
const PlayersList = styled.div`
    padding: .5rem;
`
const PlayerContainer = styled.div`
    display: flex;
    //background-color: white;
    border: 1px solid ${BORDER_GRAY};
    //box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 5px;
    height: 3rem;
    align-items: center;
    color: ${GRAY};
    margin-bottom: .5rem;
    cursor: pointer;
    &:hover {
        background-color: rgba(0,0,0,.03);
    }
`
const Rank = styled.div`
    flex: 1;
    border-right: 1px solid hsl(0, 0%, 80%);
`
const PlayerName = styled.div`
    flex: 4;
    text-align: left;
    padding-left: .5rem;
`
const Mark = styled.span`
    font-weight: bold;
    color: ${BLACK};
`
const SearchContainer = styled.div`
    margin-bottom: .5rem;
    display: flex;
    flex-direction: row;
    padding: .5rem .5rem 0 .5rem;
    column-gap: .5rem;
    /*position: fixed;
    background-color: white;
    width: 100%;*/
`
const SearchBox = styled.div`
    flex: 1;
`
const SearchInput = styled.input`
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 4px;
    outline: none;
    height: 38px;
    width: 100%;
    &::placeholder {
        text-align: center;
    }
`