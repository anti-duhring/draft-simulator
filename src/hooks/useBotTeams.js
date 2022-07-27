import data from '../data/draft_picks.json'
import teamsData from '../data/NFL_teams.json'
import { useContext, useEffect, useState } from 'react'
import { DraftContext } from '../Context/DraftContext'

export const useBotTeams = () => {
    const {
        myTeams,
        getPicksFromTeam,
        tradablePlayers,
        allPicks,
        currentPick
    } = useContext(DraftContext)
    const [dataTeams, setDataTeams] = useState(null);
    const round = 1;

    useEffect(() => {
        const arr = []
        data.teams.filter(item => myTeams.indexOf(item.id) == -1).map(item => {
            const team = {}
            team.id = item.id;
            team.pffData = {...data.teams.find(i => i.id==item.id)};
            team.nflData = {...teamsData.find(i => i.team_id == item.id)};
            team.picks = [...getPicksFromTeam(item.id)];
            team.tradablePlayers = [...tradablePlayers.filter(player => player.franchise_id==item.id)]
    
            arr.push(team)
        });
        setDataTeams([...arr]);
    },[allPicks, tradablePlayers, currentPick])

    return dataTeams
}