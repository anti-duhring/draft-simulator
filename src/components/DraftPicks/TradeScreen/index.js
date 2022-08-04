import {useState, useContext, useEffect, useRef} from 'react'
import Select from 'react-select'
import styled, { css } from "styled-components";
import data from '../../../data/draft_picks.json'
import {DraftContext} from '../../../Context/DraftContext'
import { getValueFromOffer } from '../../../services/Draft';
import { useMyTeams } from '../../../hooks/useMyTeams';
import { useCurrentTeam } from '../../../hooks/useCurrentTeam';
import { BLACK, BORDER_GRAY, DARK_BLACK, GRAY, LIGHT_ORANGE, ORANGE } from '../../../constants/Colors';
import { IconContext } from "react-icons";
import { GoSync, GoArrowBoth } from 'react-icons/go'
import ProgressBar from '../../ProgressBar';
import Button from '../../Button'
import { useBotTeams } from '../../../hooks/useBotTeams';
import { isMobile } from 'react-device-detect';
import { defaultStyles, SelectTheme } from '../../../constants/SelectStyles';
import { compareOfferValue, compareOfferValueInt } from '../../../services/Trade';

const TradeScreen = (props) => {
    const {
        tradablePlayers,
        currentPick,
        handleOfferTrade,
        isMyPick,
        NFLseason
    } = useContext(DraftContext);

    const myTeams = useMyTeams();
    const botTeams = useBotTeams();
    const [currentTeam, allOtherTeams] = useCurrentTeam(1);

    const [otherTeamID, setOtherTeamID] = useState(null)
    const [otherTeamOffer, setOtherTeamOffer] = useState([]);
    const [currentTeamOffer, setCurrentTeamOffer] = useState([]);

    const [options, setOptions] = useState(null)
    const [tradesMade, setTradesMade] = useState(0);
    const tradeWillBeAccepted = compareOfferValue({otherTeamOfferValue: getValueFromOffer(otherTeamOffer), currentTeamOfferValue: getValueFromOffer(currentTeamOffer)}, isMyPick());
    const tradeWillBeAcceptedInt = compareOfferValueInt({otherTeamOfferValue: getValueFromOffer(otherTeamOffer), currentTeamOfferValue: getValueFromOffer(currentTeamOffer)}, isMyPick())

    const otherTeamPlayerSelectRef = useRef();
    const currentTeamPlayerSelectRef = useRef();

    const optionsTradablePlayers = (teamID, position) => {
        const options = [];
        const players = tradablePlayers.filter(player => player.franchise_id==teamID).filter(p => p.position==position);
        let uniquePlayers = [];

        players.filter((p, i) => players.indexOf(p)==i).map(player => {
            if(uniquePlayers.indexOf(player.player_id)!=-1) return
            uniquePlayers.push(player.player_id);
            
            options.push({value: player , label:`${player.player_name}`});
        })
        return options
    } 

    const groupedOptionsTradablePlayers = (teamID) => {
        const groups = [];
        tradablePlayers.filter(player => player.franchise_id==teamID).map(p => p.position).filter((p, i) => tradablePlayers.filter(player => player.franchise_id==teamID).map(p => p.position).indexOf(p)==i).map(position => {
            groups.push({
                label: position,
                options: optionsTradablePlayers(teamID, position)
            })
        })
        return groups
    }
 
    const teamsOptions = (teams) => {
        const opt = [];
       teams.map(team => {
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

    const handleSelect = (newValue, actionMeta) => {
        setOtherTeamID(newValue.value);
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
        const offerValues = {
            otherTeamOfferValue: getValueFromOffer(otherTeamOffer), 
            currentTeamOfferValue: getValueFromOffer(currentTeamOffer)
        }
        handleOfferTrade(otherTeamOffer, otherTeamID, currentTeamOffer, currentTeam.id, offerValues);

        otherTeamPlayerSelectRef.current.clearValue();
        currentTeamPlayerSelectRef.current.clearValue();

        setOtherTeamOffer([]);
        setCurrentTeamOffer([]);
        setTradesMade(prevTrades => (prevTrades + 1))
    }

    useEffect(() => {
        if(!myTeams) return 

        if(isMyPick()) {
            setOptions([...teamsOptions(allOtherTeams)]);
            setOtherTeamID(prevTeamID => (prevTeamID ? myTeams.map(i => i.id).indexOf(prevTeamID) != -1 ? allOtherTeams[0].id : prevTeamID : allOtherTeams[0].id));
        } else {
            setOptions([...teamsOptions(myTeams)]);
            setOtherTeamID(prevTeamID => (prevTeamID ? myTeams.map(i => i.id).indexOf(prevTeamID) == -1 ? myTeams[0].id : prevTeamID : myTeams[0].id));
            /*{
                console.log(allOtherTeams.map(i => i.id).indexOf(prevTeamID));

                return (prevTeamID ? allOtherTeams.map(i => i.id).indexOf(prevTeamID) != -1 ? myTeams[0].id : prevTeamID : myTeams[0].id)
            });*/

        }
    },[myTeams, currentPick])
    
    useEffect(() => {
        setOtherTeamOffer([]);
        setCurrentTeamOffer([]);
    },[currentPick])

    if(!otherTeamID || !currentTeam || !options) {
        return (
            <div>Loading...</div>
        )
    } 
   
    const Slice = () => {
        return (
            <SliceContainer>
            <IconContext.Provider value={{color: BORDER_GRAY,size:isMobile? '1.3rem' : '1.5rem',style: { verticalAlign: 'middle', transform: isMobile ? 'rotate(90deg)' : 'rotate(0deg)', backgroundColor:'white' }}}>
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
                [...[...myTeams, ...botTeams].find(i => i.id == otherTeamID).picks,...currentTeam.picks].sort((a, b) => a.pick - b.pick).map((pick, index) => {
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
                                key={index} 
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
            <Teams>
            <OtherTeam>
                <Select 
                    options={options} 
                    theme={SelectTheme}
                    styles={defaultStyles}
                    value={options.find(item => item.value==otherTeamID)} 
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
                                season={NFLseason + index} 
                            />
                        )
                    })
                }
                <div style={{marginTop:'.5rem'}}>
                    <Select 
                        ref={otherTeamPlayerSelectRef}
                        options={groupedOptionsTradablePlayers(otherTeamID)} 
                        isMulti={true}
                        menuPlacement={isMobile ? 'bottom' : 'top'}
                        theme={SelectTheme}
                        styles={defaultStyles}
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
                    theme={SelectTheme}
                    styles={defaultStyles}
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
                                season={NFLseason + index} 
                            />
                        )
                    })
                }
                <div style={{marginTop:'.5rem'}}>
                    <Select 
                        ref={currentTeamPlayerSelectRef}
                        options={groupedOptionsTradablePlayers(currentTeam.id)}  
                        isMulti={true}
                        menuPlacement={isMobile ? 'bottom' : 'top'}
                        theme={SelectTheme}
                        styles={defaultStyles}
                        onChange={(newValue, actionMeta) => addPlayerToOffer(newValue, actionMeta, currentTeam.id)}
                        isSearchable={false}
                        placeholder='Adicionar jogador'
                    />
                </div>
            </CurrentTeam>
            </Teams>
            <Footer>
            <TradeProgress>
                    <ProgressBar
                        style={{height:'.8rem'}}
                        progress={
                            (getValueFromOffer(otherTeamOffer) > 0 && getValueFromOffer(currentTeamOffer) > 0) ?
                            tradeWillBeAcceptedInt
                            : 
                            0
                        }
                    />
                    <TradeProgressLegend>
                        {(getValueFromOffer(otherTeamOffer) > 0 && getValueFromOffer(currentTeamOffer) > 0) ?
                         tradeWillBeAccepted==0?
                         'O valor da sua oferta é muito baixo' : tradeWillBeAccepted == -1? 'Sua oferta é muito alta' : 'A troca provavelmente será aceita' :
                         'Chance da troca ser aceita'
                        }
                    </TradeProgressLegend>
                </TradeProgress>
                <div>
                    <Button onClick={offerTrade}>Propor troca</Button>
                </div>
            </Footer>
        </Container>
     );
}
 
export default TradeScreen;

const Container = styled.div`
    padding: 0.5rem;
    width: ${isMobile? '100vw' : '100%'};
    overflow:  ${isMobile ? 'auto' : 'none'};
    height: ${isMobile ? '100%' : 'auto'};
    display: flex;
    flex-direction: column;
`
const OtherTeam = styled.div`
    flex:1;
`
const CurrentTeam = styled.div`
    flex:1;
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
    cursor: pointer;

    &:hover {
        color: ${props.isAvaliable ? ORANGE : 'hsl(0, 0%, 60%)'};
    }
`)
const PickItemPick = styled.div`
    flex: 1;
    font-weight: bold;
`
const PickItemLegend = styled.div((props) => css`
    color: ${GRAY}; 
    flex: 1;
    font-size: .7rem;
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
    display: flex;
    justify-content: center;
    align-items: center;
`
const Line = styled.div`
    width: ${isMobile? '100%' : '1px'};
    background-color: ${BORDER_GRAY};
    height: ${isMobile? '2px' : '70%'};
    position: absolute;
    top: ${isMobile? '50%' : '15%'};
    left: ${isMobile? '0%' : '50%'};
`
const TradeProgress = styled.div`
    display: flex;
    align-items: center;
    margin: .5rem 0 .5rem 0;
`
const TradeProgressLegend = styled.div`
   margin-left: .5rem;
   color: ${GRAY};
   font-size: .8rem;
`
const Footer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
`
const Teams = styled.div`
    display: flex;
    flex-direction: ${isMobile? 'column' : 'row'};
    column-gap: 1rem;
    overflow: ${isMobile ? 'none' : 'auto'};
    height: ${isMobile ? 'auto' : '70vh'};
    /*&::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	    border-radius: 10px;
	    background-color: #F5F5F5;
    }
    &::-webkit-scrollbar {
        width: 12px;
	    background-color: #F5F5F5;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
	    background-color: ${DARK_BLACK};
    }*/
`