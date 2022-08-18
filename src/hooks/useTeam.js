//import data from '../data/draft_picks.json'
import teamsData from '../data/NFL_teams.json'
import { useContext, useEffect, useState } from 'react'
import { DraftContext } from '../Context/DraftContext'

export const useTeam = (id) => {
    const {
        getPicksFromTeam,
        tradablePlayers,
        tradeHistory,
        draftNeeds,
        data
    } = useContext(DraftContext)
    const [dataTeam, setDataTeam] = useState(null);

    useEffect(() => {
        data.teams.find(item => item.id == id).map(item => {
            const team = {}
            team.id = item.id;
            team.pffData = {...data.teams.find(i => i.id==item.id)};
            team.nflData = {...teamsData.find(i => i.team_id == item.id)};
            team.picks = [...getPicksFromTeam(item.id)];
            team.tradablePlayers = [...tradablePlayers.filter(player => player.franchise_id==item.id)]
            team.tradeHistory = [...tradeHistory?.filter(i =>  i.teams_involved.indexOf(item.id) != -1)]
            team.draftNeeds = draftNeeds[item.id]
    
            setDataTeam(team);
        });
        
    },[])

    return dataTeam
}