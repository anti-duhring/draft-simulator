import {useState, useContext, useEffect} from 'react'
import Select from 'react-select'
import styled, { css } from "styled-components";
import data from '../../../data/draft_picks.json'
import teamsData from '../../../data/NFL_teams.json'
import {DraftContext} from '../../../Context/DraftContext'
import { BLACK, BORDER_GRAY, GRAY, ORANGE } from '../../../constants/Colors';
import { IconContext } from "react-icons";
import { GoSync, GoArrowBoth } from 'react-icons/go'
import ProgressBar from '../../ProgressBar';
import Button from '../../Button'

const TradeScreen = (props) => {
    const {
        myTeams,
        draftOrder,
        allPicks,
        setAllPicks,
        currentPick,
        NFLseason,
        getPicksFromTeam,
        getValueFromFuturePicks,
        handleOfferTrade
    } = useContext(DraftContext)

    const myTeamsData = data.teams.filter(team => myTeams.indexOf(team.franchise_id)!=-1);

    const options = myTeamsData.map(team => {
        const teamData = teamsData.find(item => item.team_abbr==team.abbreviation)
        const teamNextPick = getPicksFromTeam(team.id).find(item => item.pick > currentPick);

        return {value: team.id, label:(
        <Option>
            <OptionLogo src={teamData.team_logo_espn} /> <OptionName>{team.nickname}</OptionName>
            <OptionPick>- Próxima pick {teamNextPick.pick}</OptionPick>
        </Option>
        ) }
    });

    const [otherTeamID, setOtherTeamID] = useState(options[0].value)
    const [otherTeamPicks, setOtherTeamPicks] = useState(getPicksFromTeam(options[0].value));
    const [otherTeamOffer, setOtherTeamOffer] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(data.teams.find(item => item.id==allPicks[1][currentPick - 1].current_team_id));
    const [currentTeamPicks, setCurrentTeamPicks] = useState(getPicksFromTeam(currentTeam.id));
    const [currentTeamOffer, setCurrentTeamOffer] = useState([]);

    const getOption = (team) => {

        const teamData = teamsData.find(item => item.team_id == team.id);

        const teamNextPick = getPicksFromTeam(team.id).find(item => item.pick >= currentPick);

        return {value: team.id, label:(
            <Option>
                <OptionLogo src={teamData.team_logo_espn} /> <OptionName>{team.nickname}</OptionName>
                <OptionPick>- Próxima pick {teamNextPick.pick}</OptionPick>
            </Option>
            ) }
    }

    const handleSelect = (newValue, actionMeta) => {
        setOtherTeamID(prevID => (newValue.value));
        setOtherTeamPicks(getPicksFromTeam(newValue.value));
        setOtherTeamOffer([]);
    }

    const getValueFromOffer = (offer) => {
        let value = 0;
        offer.map(item => {
            if(item.pick==0) {
                value += getValueFromFuturePicks(item.round)
            } else {
                const val = data.pick_trade_values.find(i => i.pick == item.pick);
                value += val.chart_value
            }
        })

        return value
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
        setOtherTeamPicks(prevPicks => getPicksFromTeam(otherTeamID));
        setCurrentTeamPicks(prevPicks => getPicksFromTeam(currentTeam.id));
    }
    
    useEffect(() => {
        setCurrentTeam(data.teams.find(item => item.id==allPicks[1][currentPick - 1].current_team_id));
        setOtherTeamID(options[0].value);
        setOtherTeamPicks(getPicksFromTeam(options[0].value));
        setOtherTeamOffer([]);
        setCurrentTeamPicks(getPicksFromTeam(data.teams.find(item => item.id==allPicks[1][currentPick - 1].current_team_id).id));
        setCurrentTeamOffer([]);
    },[currentPick])

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
            { 
                [...otherTeamPicks,...currentTeamPicks].map((pick, index) => {
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
                    defaultValue={options[0] || {value: 0, label: 'Hm'}} 
                    onChange={handleSelect}
                />
                {
                    new Array(3).fill(0).map((item, index) => {
                        return (
                            <TeamPicks 
                                key={index}
                                team="otherTeam" 
                                typePicks={index > 0? 'futurePick' : 'currentPick'}
                                season={2023 + index} 
                            />
                        )
                    })
                }
            </OtherTeam>
            <Slice />
            <CurrentTeam>
                <Select 
                    isDisabled={true}
                    //defaultValue={getOption(currentTeam)} 
                    value={getOption(currentTeam)}
                />
                {
                    new Array(3).fill(0).map((item, index) => {
                        return (
                            <TeamPicks 
                                key={index}
                                team="currentTeam" 
                                typePicks={index > 0? 'futurePick' : 'currentPick'}
                                season={2023 + index} 
                            />
                        )
                    })
                }
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
`
const TradeProgressLegend = styled.div`
   margin-left: .5rem;
   color: ${GRAY}
`