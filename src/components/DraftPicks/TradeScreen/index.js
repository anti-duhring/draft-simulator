import {useState, useContext, useEffect, useRef} from 'react'
import Select from 'react-select'
import styled, { css } from "styled-components";
import data from '../../../data/draft_picks.json'
import teamsData from '../../../data/NFL_teams.json'
import {DraftContext} from '../../../Context/DraftContext'
import { getValueFromOffer } from '../../../services/Draft';
import { useMyTeams } from '../../../hooks/useMyTeams';
import { useCurrentTeam } from '../../../hooks/useCurrentTeam';
import { BLACK, BORDER_GRAY, GRAY, ORANGE } from '../../../constants/Colors';
import { IconContext } from "react-icons";
import { GoSync, GoArrowBoth } from 'react-icons/go'
import ProgressBar from '../../ProgressBar';
import Button from '../../Button'

const TradeScreen = (props) => {
    const {
        tradablePlayers,
        currentPick,
        handleOfferTrade
    } = useContext(DraftContext);

    const myTeams = useMyTeams();
    const currentTeam = useCurrentTeam(1);

    const [otherTeamID, setOtherTeamID] = useState(null)
    const [otherTeamOffer, setOtherTeamOffer] = useState([]);
    const [currentTeamOffer, setCurrentTeamOffer] = useState([]);
    const [tradesMade, setTradesMade] = useState(0);

    const otherTeamPlayerSelectRef = useRef();
    const currentTeamPlayerSelectRef = useRef();

    const optionsTradablePlayers = (teamID) => {
        const options = [];
        tradablePlayers.filter(player => player.franchise_id==teamID).map(player => {
            options.push({value: player , label:`${player.player_name} - ${player.position}`});
        })
        return options
    } 
 
    const myTeamsOptions = () => {
        const opt = [];
        myTeams?.map(team => {
            opt.push({
                value: team.id,
                label:(
                    <Option>
                        <OptionLogo src={team.nflData.team_logo_espn} /> <OptionName>{team.nflData.team_nick}</OptionName>
                        <OptionPick>- Próxima pick {team.picks.find(p => p.pick > currentPick).pick}</OptionPick>
                    </Option>
                )
            });
        })
        return opt
    }
    const [options, setOptions] = useState([...myTeamsOptions()])

    const handleSelect = (newValue, actionMeta) => {
        setOtherTeamID(prevID => (newValue.value));
        setOtherTeamOffer([]);
    }

    const addPlayerToOffer = (newValue, actionMeta, team) => {
        const selected = [];
        newValue.map(item => {
            selected.push(item.value)
        })
        if(team==otherTeamID) {
            setOtherTeamOffer(prevOffer => ([
                ...prevOffer.filter(item => !item.player_id),
                ...selected
            ]))
        } else {
            setCurrentTeamOffer(prevOffer => ([
                ...prevOffer.filter(item => !item.player_id),
                ...selected
            ]))
        }
       
    }

    const addPickToOffer = (team, pick) => {
        if(team=='otherTeam') {
            setOtherTeamOffer(prevOffer => prevOffer.findIndex(item => item == pick) !=-1 ?

            ([...prevOffer.filter(item => item != pick)]) : 
            ([...prevOffer, pick])
            );

        } else {
            setCurrentTeamOffer(prevOffer => prevOffer.findIndex(item => item == pick) !=-1 ? 
            
            ([...prevOffer.filter(item => item != pick)]) :
            ([...prevOffer, pick]));
        }
    }

    const offerTrade = () => {
        handleOfferTrade(otherTeamOffer, otherTeamID, currentTeamOffer, currentTeam.id);

        otherTeamPlayerSelectRef.current.clearValue();
        currentTeamPlayerSelectRef.current.clearValue();

        setOtherTeamID(options[0]?.value);
        setOtherTeamOffer([]);
        setCurrentTeamOffer([]);
        setTradesMade(prevTrades => (prevTrades + 1))
    }

    useEffect(() => {
        if(!myTeams) return 

        setOtherTeamID(myTeams[0].id);
        setOptions([...myTeamsOptions()]);
    },[myTeams])
    
    useEffect(() => {
        
        setOtherTeamID(myTeams? myTeams[0].id : null)
        setOtherTeamOffer([]);
        setCurrentTeamOffer([]);
    },[currentPick])

    useEffect(() => {
        setOptions([...myTeamsOptions()]);
    },[tradesMade])

    if(!otherTeamID || !currentTeam) {
        return (
            <div>Loading...</div>
        )
    } else if(!myTeams || myTeams.map(i => i.id).indexOf(currentTeam.id) != -1) {
        return (
            <div>You trade</div>
        )
    }
   
    const Slice = () => {
        return (
            <SliceContainer>
            <IconContext.Provider value={{color: BORDER_GRAY,size:'1.3rem',style: { verticalAlign: 'middle', transform: 'rotate(90deg)', backgroundColor:'white' }}}>
                <Line />
                <GoArrowBoth />
            </IconContext.Provider>
        </SliceContainer>
        )
    }

    const PickItem = ({pick, isAvaliable, team}) => {
        const teamID = team == 'otherTeam' ? otherTeamID : currentTeam.id;
        const viaTeamData = data.teams.find(team => team.franchise_id==pick.original_team_id);

        return (
            <PickItemContainer 
                isAvaliable={isAvaliable} 
                selected={[...otherTeamOffer,...currentTeamOffer].map(item => item.pick).indexOf(pick.pick)!=-1}
                onClick={() => isAvaliable ? addPickToOffer(team, pick) : null}
            >
                <PickItemPick>{pick.pick}</PickItemPick>
                <PickItemLegend>
                    <span>pick</span>
                    {pick.original_team_id != teamID && 
                    <span className='viaLegend'>via {viaTeamData.abbreviation}</span>
                    }
                </PickItemLegend>
            </PickItemContainer>
        )
    }

    const FuturePickItem = ({pick, team}) => {
        const teamID = team == 'otherTeam' ? otherTeamID : currentTeam.id;
        const viaTeamData = data.teams.find(team => team.franchise_id==pick.original_team_id);

        return (
            <PickItemContainer 
                isAvaliable
                selected={[...otherTeamOffer,...currentTeamOffer].findIndex(item => item==pick)!=-1}
                onClick={() => addPickToOffer(team, pick)}
            >
                <PickItemPick>{pick.round}</PickItemPick>
                <PickItemLegend futurePick={true}>
                    <span>round</span>
                    {pick.original_team_id != teamID && 
                    <span className='viaLegend'>via {viaTeamData.abbreviation}</span>
                    }
                </PickItemLegend>
            </PickItemContainer>
        )
    }

    const TeamPicks = ({season, team, typePicks}) => {
        return (
            <TeamPicksContainer>
            <Title>{season}</Title>
            <Grid>
            { otherTeamID && currentTeam &&
                [...myTeams.find(i => i.id == otherTeamID).picks,...currentTeam.picks].sort((a, b) => a.pick - b.pick).map((pick, index) => {
                    if(pick.season != season) return
                    if(team == 'otherTeam' && pick.current_team_id == currentTeam.id || team =='currentTeam' && pick.current_team_id != currentTeam.id) return

                    if(typePicks=='futurePick') {
                        return (
                            <FuturePickItem 
                                key={index}
                                pick={pick}
                                team={team}
                            />
                        )

                    } else {
                        return (
                            <PickItem 
                                key={pick.pick} 
                                isAvaliable={currentPick <= pick.pick} 
                                pick={pick} 
                                team={team}
                            />
                        )
                    }
                })
            }
            </Grid>
        </TeamPicksContainer>
        )
    }

    return ( 
        <Container>
            <OtherTeam>
                Selecione um dos seus times para compor a troca:
                <Select 
                    options={options} 
                    defaultValue={options[0]} 
                    onChange={handleSelect}
                    isSearchable={false}
                />
                {
                    new Array(3).fill(0).map((item, index) => {
                        return (
                            <TeamPicks 
                                key={`otherTeam${index}`}
                                team="otherTeam" 
                                typePicks={index > 0? 'futurePick' : 'currentPick'}
                                season={2023 + index} 
                            />
                        )
                    })
                }
                <div style={{marginTop:'.5rem'}}>
                    <Select 
                        ref={otherTeamPlayerSelectRef}
                        options={optionsTradablePlayers(otherTeamID)} 
                        isMulti={true}
                        onChange={(newValue, actionMeta) => addPlayerToOffer(newValue, actionMeta, otherTeamID)}
                        isSearchable={false}
                        placeholder='Adicionar jogador'
                    />
                </div>
            </OtherTeam>
            <Slice />
            <CurrentTeam>
                <Select 
                    isDisabled={true} 
                    value={{value: currentTeam.id, label: (
                        <Option>
                            <OptionLogo src={currentTeam.nflData.team_logo_espn} /> <OptionName>{currentTeam.nflData.team_nick}</OptionName>
                            <OptionPick>- Próxima pick {currentTeam.picks.find(p => p.pick > currentPick).pick}</OptionPick>
                        </Option>
                    )}}
                />
                {
                    new Array(3).fill(0).map((item, index) => {
                        return (
                            <TeamPicks 
                                key={`currentTeam${index}`}
                                team="currentTeam" 
                                typePicks={index > 0? 'futurePick' : 'currentPick'}
                                season={2023 + index} 
                            />
                        )
                    })
                }
                <div style={{marginTop:'.5rem'}}>
                    <Select 
                        ref={currentTeamPlayerSelectRef}
                        options={optionsTradablePlayers(currentTeam.id)}  
                        isMulti={true}
                        onChange={(newValue, actionMeta) => addPlayerToOffer(newValue, actionMeta, currentTeam.id)}
                        isSearchable={false}
                        placeholder='Adicionar jogador'
                    />
                </div>
                <TradeProgress>
                    <ProgressBar
                        //style={{flex:1}}
                        progress={
                            (getValueFromOffer(otherTeamOffer) > 0 && getValueFromOffer(currentTeamOffer) > 0) ?

                            (100 * getValueFromOffer(otherTeamOffer)) / (getValueFromOffer(currentTeamOffer)) : 0
                        }
                    />
                    <TradeProgressLegend>
                        Chance da troca ser aceita
                    </TradeProgressLegend>
                </TradeProgress>
                <div>
                    <Button onClick={offerTrade}>Propor troca</Button>
                </div>
            </CurrentTeam>
        </Container>
     );
}
 
export default TradeScreen;

const Container = styled.div`
    padding: 0.5rem;
    width: 100%;
    overflow: auto;
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
const TeamPicksContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid ${BORDER_GRAY};
    //box-shadow: 0 1px 3px rgb(22 24 26 / 10%), 0 5px 10px -3px rgb(22 24 26 / 5%);
    border-radius: 5px;
    align-items: center;
    color: ${GRAY};
    padding: .3rem;
    padding-bottom: .5rem;
    margin-top: .5rem;
`
const Grid = styled.div`
    flex: 1;
    //display: grid;
    //grid-template: auto / repeat(auto-fill, 50px);
    //grid-gap: .5rem;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
`
const Title = styled.div`
    flex: 1;
    width: 100%;
    text-align: center;
    margin-bottom: .3rem;
`
const PickItemContainer = styled.div((props) => css`
    border: 1px solid ${props.isAvaliable ? props.selected ? ORANGE : BORDER_GRAY : 'hsl(0, 0%, 90%)'};
    border-radius: 5px;
    padding: .3rem;
    width: 50px;
    margin-right: .5rem;
    margin-bottom: .5rem;
    display: flex;
    flex-direction: column;
    background-color: ${props.isAvaliable ? 'transparent' : 'hsl(0, 0%, 95%)'};
    color: ${props.isAvaliable ? BLACK : 'hsl(0, 0%, 60%)'};
`)
const PickItemPick = styled.div`
    flex: 1;
    font-weight: bold;
`
const PickItemLegend = styled.div((props) => css`
    color: ${GRAY}; 
    flex: 1;
    font-size: .8rem;
    display: flex;
    flex-direction: column;
    .viaLegend {
        font-size: .5rem;
    }
`)
const SliceContainer = styled.div`
    position: relative;
    margin-top: 1rem;
    margin-bottom: 1rem;
`
const Line = styled.div`
    width: 100%;
    background-color: ${BORDER_GRAY};
    height: 2px;
    position: absolute;
    top: 50%;
`
const TradeProgress = styled.div`
    display: flex;
    align-items: center;
    margin: .5rem 0 .5rem 0;
`
const TradeProgressLegend = styled.div`
   margin-left: .5rem;
   color: ${GRAY}
`