import teamsData from '../data/NFL_teams.json'
import { useContext, useEffect, useState } from 'react'
import { DraftContext } from '../Context/DraftContext'

export const useCurrentTeam = (round) => {
    const {
        currentPick,
        allPicks,
        getPicksFromTeam,
        tradablePlayers,
        tradeHistory,
        draftNeeds,
        data
    } = useContext(DraftContext)
    const [currentTeam, setCurrentTeam] = useState(null);
    const [allOtherTeams, setAllOtherTeams] = useState(null)

    useEffect(() => {
        if(currentPick<=0) return

        const arr = [];
        const team = {};
        const item = data.teams.find(item => item.id==[...allPicks[1], ...allPicks[2]][currentPick - 1].current_team_id);
        team.id = item.id;
        team.pffData = {...item};
        team.nflData = {...teamsData.find(i => i.team_id == item.id)};
        team.picks = [...getPicksFromTeam(item.id)];
        team.tradablePlayers = [...tradablePlayers.filter(player => player.franchise_id==item.id)]
        team.tradeHistory = [...tradeHistory?.filter(i =>  i.teams_involved.indexOf(item.id) != -1)]
        team.draftNeeds = draftNeeds[item.id]

        setCurrentTeam(team);

        const teamsAlreadyMapped = [];
        data.teams.filter(i => i.id != [...allPicks[1], ...allPicks[2]][currentPick - 1].current_team_id && teamsAlreadyMapped.indexOf(i.id)==-1).map(item => {
            const team = {}
            team.id = item.id;
            teamsAlreadyMapped.push(item.id);
            team.pffData = {...data.teams.find(i => i.id==item.id)};
            team.nflData = {...teamsData.find(i => i.team_id == item.id)};
            team.picks = [...getPicksFromTeam(item.id)];
            team.tradablePlayers = [...tradablePlayers.filter(player => player.franchise_id==item.id)]
            team.tradeHistory = [...tradeHistory?.filter(i =>  i.teams_involved.indexOf(item.id) != -1)]
            team.draftNeeds = draftNeeds[item.id]
    
            arr.push(team);
        });
        setAllOtherTeams([...arr])
    },[allPicks, tradablePlayers, currentPick])

    return [currentTeam, allOtherTeams]
}