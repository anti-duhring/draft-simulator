import data from '../data/draft_picks.json'
import teamsData from '../data/NFL_teams.json'
import { useContext, useEffect, useState } from 'react'
import { DraftContext } from '../Context/DraftContext'

export const useMyTeams = () => {
    const {
        myTeams,
        getPicksFromTeam,
        tradablePlayers,
        allPicks,
        currentPick,
        tradeHistory,
        draftNeeds
    } = useContext(DraftContext)
    const [dataTeams, setDataTeams] = useState(null);
    const round = 1;

    useEffect(() => {
        const arr = []
        myTeams.map(item => {
            const team = {}
            team.id = item;
            team.pffData = {...data.teams.find(i => i.id==item)};
            team.nflData = {...teamsData.find(i => i.team_id == item)};
            team.picks = [...getPicksFromTeam(item)];
            team.tradablePlayers = [...tradablePlayers.filter(player => player.franchise_id==item)]
            team.tradeHistory = [...tradeHistory?.filter(i =>  i.teams_involved.indexOf(item) != -1)]
            team.draftNeeds = draftNeeds[item]
    
            arr.push(team)
        });
        setDataTeams([...arr]);
    },[allPicks, tradablePlayers, currentPick])

    return dataTeams
}