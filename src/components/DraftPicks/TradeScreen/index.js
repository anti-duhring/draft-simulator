import {useState, useContext} from 'react'
import Select from 'react-select'
import styled, { css } from "styled-components";
import data from '../../../data/draft_picks.json'
import teamsData from '../../../data/NFL_teams.json'
import {DraftContext} from '../../../Context/DraftContext'
import { BLACK, BORDER_GRAY, GRAY, ORANGE } from '../../../constants/Colors';
import { IconContext } from "react-icons";
import { GoSync, GoArrowBoth } from 'react-icons/go'
import ProgressBar from '../../ProgressBar';

const TradeScreen = (props) => {
    const {
        myTeams,
        draftOrder,
        allPicks,
        currentPick,
        getPicksFromTeam,
        getValueFromFuturePicks
    } = useContext(DraftContext)

    const myTeamsData = data.teams.filter(team => myTeams.indexOf(team.franchise_id)!=-1);

    const options = myTeamsData.map(team => {
        const teamData = teamsData.find(item => item.team_abbr==team.abbreviation)
        const teamNextPick = getPicksFromTeam(team.id).find(item => item.pick >= currentPick);

        return {value: team.id, label:(
        <Option>
            <OptionLogo src={teamData.team_logo_espn} /> <OptionName>{team.nickname}</OptionName>
            <OptionPick>- Próxima pick {teamNextPick.pick}</OptionPick>
        </Option>
        ) }
    });

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

    const [otherTeamPicks, setOtherTeamPicks] = useState(getPicksFromTeam(options[0].value));
    const [otherTeamOffer, setOtherTeamOffer] = useState([]);
    const [
        otherTeamOfferValue, 
        setOtherTeamOfferValue
    ] = useState(0);

    const currentTeam = data.teams.find(item => item.id==allPicks.round1[currentPick - 1].current_team_id);
    const [currentTeamOffer, setCurrentTeamOffer] = useState([]);
    const [currentTeamOfferValue, setCurrentTeamOfferValue] = useState(0);
    

    const handleSelect = (newValue, actionMeta) => {
        setOtherTeamPicks(getPicksFromTeam(newValue.value));
    }

    const getValueFromOffer = (offer) => {
        let value = 0;
        offer.map(item => {
            const val = data.pick_trade_values.find(i => i.pick == item.pick);
            value += val.chart_value
        })

        return value
    }

    const addPickToOffer = (team, pick) => {
        if(team=='otherTeam') {
            setOtherTeamOffer(prevOffer => prevOffer.map(item => item.pick).indexOf(pick.pick)!=-1 ? ([...prevOffer.filter(item => item.pick != pick.pick)]) : ([...prevOffer, pick]));

            //([...prevOffer, pick])

        } else {
            setCurrentTeamOffer(prevOffer => prevOffer.map(item => item.pick).indexOf(pick.pick)!=-1 ? ([...prevOffer.filter(item => item.pick != pick.pick)]) : ([...prevOffer, pick]));
        }
    }

    const PickItem = ({pick, isAvaliable, team}) => {
        return (
            <PickItemContainer 
                isAvaliable={isAvaliable} 
                selected={[...otherTeamOffer,...currentTeamOffer].map(item => item.pick).indexOf(pick.pick)!=-1}
                onClick={() => isAvaliable ? addPickToOffer(team, pick) : null}
            >
                <PickItemPick>{pick.pick}</PickItemPick>
                <PickItemLegend>pick</PickItemLegend>
            </PickItemContainer>
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
                />
                <TeamPicks>
                    <Title>2023</Title>
                    <Grid>
                    {otherTeamPicks &&
                        otherTeamPicks.map(pick => {
                            if(pick.season != 2023) return

                            return (
                                <PickItem 
                                    key={pick.pick} 
                                    isAvaliable={currentPick < pick.pick} 
                                    pick={pick} 
                                    team='otherTeam'
                                />
                            )
                        })
                    }
                    </Grid>
                </TeamPicks>
                <TeamPicks>
                    <Title>2024</Title>
                    <Grid>
                    {otherTeamPicks &&
                        otherTeamPicks.map(pick => {
                            if(pick.season != 2024) return
                            
                            return (
                                <PickItem 
                                    key={pick.pick} 
                                    isAvaliable={true} 
                                    pick={pick} 
                                    team='otherTeam'
                                />
                            )
                        })
                    }
                    </Grid>
                </TeamPicks>
                <div>
                    {getValueFromOffer(otherTeamOffer)} 
                </div>
            </OtherTeam>
            <Slice>
                <IconContext.Provider value={{color: BORDER_GRAY,size:'1.3rem',style: { verticalAlign: 'middle', transform: 'rotate(90deg)', backgroundColor:'white' }}}>
                    <Line />
                    <GoArrowBoth />
                </IconContext.Provider>
            </Slice>
            <CurrentTeam>
                <Select 
                    isDisabled={true}
                    defaultValue={getOption(currentTeam)} 
                />
                <TeamPicks>
                    <Title>2023</Title>
                    <Grid>
                    {
                    getPicksFromTeam(currentTeam.id).map(pick => {
                        if(pick.season != 2023) return
                            return (
                                <PickItem 
                                    key={pick.pick} 
                                    isAvaliable={currentPick <= pick.pick} 
                                    pick={pick} 
                                    team='currentTeam'
                                />
                            )
                        })
                    }
                    </Grid>
                </TeamPicks>
                <div>
                    {getValueFromOffer(currentTeamOffer)}
                </div>
                <TradeProgress>
                    <ProgressBar
                        //style={{flex:1}}
                        progress={
                            (getValueFromOffer(otherTeamOffer) > 0 && getValueFromOffer(currentTeamOffer) > 0) ?

                            (100 * getValueFromOffer(otherTeamOffer)) / (getValueFromOffer(currentTeamOffer) / 1.5) : 0
                        }
                    />
                    <TradeProgressLegend>
                        Chance da troca ser aceita
                    </TradeProgressLegend>
                </TradeProgress>
            </CurrentTeam>
        </Container>
     );
}
 
export default TradeScreen;

const Container = styled.div`
    padding: 0.5rem;
    width: 100%;
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
const TeamPicks = styled.div`
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
    display: grid;
    grid-template: auto / repeat(auto-fill, 40px);
    grid-gap: .5rem;
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
    display: flex;
    flex-direction: column;
    background-color: ${props.isAvaliable ? 'transparent' : 'hsl(0, 0%, 95%)'};
    color: ${props.isAvaliable ? BLACK : 'hsl(0, 0%, 60%)'};
`)
const PickItemPick = styled.div`
    flex: 1;
    font-weight: bold;
`
const PickItemLegend = styled.div`
    color: ${GRAY}; 
    flex: 1;
`
const Slice = styled.div`
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