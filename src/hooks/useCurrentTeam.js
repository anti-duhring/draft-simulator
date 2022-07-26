import data from '../data/draft_picks.json'
import teamsData from '../data/NFL_teams.json'
import { useContext, useEffect, useState } from 'react'
import { DraftContext } from '../Context/DraftContext'

export const useCurrentTeam = (round) => {
    const {
        currentPick,
        allPicks,
        getPicksFromTeam,
        tradablePlayers
    } = useContext(DraftContext)
    const [currentTeam, setCurrentTeam] = useState(null);

    useEffect(() => {
        const team = {};
        const item = data.teams.find(item => item.id==allPicks[round][currentPick - 1].current_team_id);
        team.id = item.id;
        team.pffData = {...item};
        team.nflData = {...teamsData.find(i => i.team_id == item.id)};
        team.picks = [...getPicksFromTeam(item.id)];
        team.tradablePlayers = [...tradablePlayers.filter(player => player.franchise_id==item.id)]

        setCurrentTeam(team);
    },[])

    return currentTeam
}