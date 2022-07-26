import data from '../data/draft_picks.json'
import teamsData from '../data/NFL_teams.json'
import { useContext, useEffect, useState } from 'react'
import { DraftContext } from '../Context/DraftContext'

export const useMyTeams = () => {
    const {
        myTeams,
        getPicksFromTeam,
        tradablePlayers
    } = useContext(DraftContext)
    const [dataTeams, setDataTeams] = useState(null);

    useEffect(() => {
        const arr = []
        myTeams.map(item => {
            const team = {}
            team.id = item;
            team.pffData = {...data.teams.find(i => i.id==item)};
            team.nflData = {...teamsData.find(i => i.team_id == item)};
            team.picks = [...getPicksFromTeam(item)];
            team.tradablePlayers = [...tradablePlayers.filter(player => player.franchise_id==item)]
    
            arr.push(team)
        });
        setDataTeams(arr);
    },[])

    return dataTeams
}