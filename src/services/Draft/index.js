import data from '../../data/draft_picks.json'

export const getFuturePicks = (order, season) => {
    let rounds = {
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": [],
    }
    order.map((team, index) => {
        for(let i = 1; i<=7; i++) {
            rounds[i].push({
                round: i,
                pick: 0,
                season: season,
                original_team_id: team.id,
                current_team_id: team.id,
                pick_id: index,
                player_picked: null,
            })
        }
    })
    return rounds
}

export const getPicks = (order, round, season) => {
    const arr = []
    order.map((team, index) => {
        arr.push({
            round: round,
            pick: (index +1) + (32 * (round - 1)),
            season: season,
            original_team_id: team.id,
            current_team_id: team.id,
            pick_id: index,
        })
    })
    return arr;
}

export const chosePlayerToDraft = (playersAlreadyChosed, allPlayers, needsObject, currentObject) => {
    const positions = {
        "CB": ["CB"],
        "OT": ["T"],
        "TE": ["TE"],
        "IOL": ["G", "C"],
        "LB": ["LB"],
        "QB": ["QB"],
        "EDGE": ["ED"],
        "DL": ["DI"],
        "RB": ["HB"],
        "S": ["S"],
        "WR": ["WR"]
    }
    const currentTeamNeeds = needsObject.draftNeeds[currentObject.currentTeamID]
    let needValues = {}

    // Create value for each team need. First need has more value than second need and so on
    currentTeamNeeds.map((need, index) => {
        for(let i = 0; i < positions[need].length; i++) {
            needValues[positions[need][i]] = 100/(index + 1)
        }
        
    })
    //console.log(needValues)

    const playersAvaliable = allPlayers.filter(item => playersAlreadyChosed.indexOf(item.id)==-1);
    const playersFilteredByNeedsAndADP = playersAvaliable.filter(p => p.adp <= currentObject.currentPick && needValues[p.position]);

    // If there is at least one player who have an ADP less or equal than the currennt pick so pick the first player
    if(playersFilteredByNeedsAndADP.length) {
        let newDraftNeeds = {...needsObject.draftNeeds}

        playersFilteredByNeedsAndADP.sort((a, b) => a.adp - b.adp)
        
        // Find what position is this player based on the object "positions"
        const playerToPickPositionIndex = Object.entries(positions).map(key => key[1]).findIndex(key => key.indexOf(playersFilteredByNeedsAndADP[0]) != -1);
        const playerToPickPosition = Object.keys(positions)[playerToPickPositionIndex];

        // Remove this need 
        newDraftNeeds[currentObject.currentTeamID] = currentTeamNeeds.filter(n => n != playerToPickPosition)

        //needsObject.setDraftNeeds(newDraftNeeds)
        return playersFilteredByNeedsAndADP[0]
    }

    // Create a new array containing the player and his need value, which is based on what position this player are. 
    // Players in high positions has more value, because of that the value is based either on the "needValues" of his position and his index
    let playersValueList = playersAvaliable.map((player, index) => {
        if(needValues[player.position]) {
            // Value of the player whose position IS needed
            return {
                player: player, 
                value: needValues[player.position] - (index + 1)
            }
        } else {
            // Value of the player whose position is NOT needed
            return {
                player: player,
                value: 1 - (index + 1)
            }
        }
    })
    // Sort "playersValueList" based on values
    playersValueList.sort((a, b) => b.value - a.value)


    const playerToDraft = playersValueList[0].player;
    return playerToDraft
}

export const getValueFromFuturePicks = (round) => {
    let i = {
        "1": { value: 0, count: 0 },
        "2": { value: 0, count: 0 },
        "3": { value: 0, count: 0 },
        "4": { value: 0, count: 0 },
        "5": { value: 0, count: 0 },
        "6": { value: 0, count: 0 },
        "7": { value: 0, count: 0 }
    }

    data.pick_trade_values.map(item => {
        const p = item.pick;
        let r = 0;
        if(p <= 32) {
            r = 1;
        } else if(p <= 32 * 2) {
            r = 2;
        } else if(p <= 32 * 3) {
            r = 3;
        } else if(p <= 32 * 4) {
            r = 4;
        } else if(p <= 32 * 5) {
            r = 5;
        } else if(p <= 32 * 6) {
            r = 6;
        } else {
            r = 7;
        }
        i[r].value += item.chart_value;
        i[r].count++
    })
    return i[round].value / i[round].count
    
}

export const getValueFromOffer = (offer) => {
    let value = 0;
    offer.map(item => {
       if(item?.player_id) {
            value += item.value_traded_away;
            return
        }

        if(item.pick==0) {
            value += getValueFromFuturePicks(item.round)
        } else {
            const val = data.pick_trade_values.find(i => i.pick == item.pick);
            value += val.chart_value
        }
    })

    return value
}

export const myTeamsData = (myTeams) => {
    data.teams.filter(team => myTeams.indexOf(team.franchise_id)!=-1);
}

export const scrollToPick = (pick) => {
    const pickItem = document.querySelector(`.pick-${pick}`);
    if(!pickItem) return

    pickItem.scrollIntoView({
        behavior: 'smooth'
    });
}

export const changeBGColor = (cssClass, color) => {
    document.querySelector(cssClass).style.backgroundColor = color
}

export const hasToGoToSecondRound = (currentPick, setCurrentRound, totalPicksToDraft) => {
    if(totalPicksToDraft == 32) return 

    if(currentPick==32) setCurrentRound(2)
}

export const changePlayersOwners = (offer,teams, tradablePlayers) => {
    let newTradablePlayers = [...tradablePlayers];

    offer.map(player => {
        let thisPlayer = {...player};
        let thisPlayerIndex = newTradablePlayers.findIndex(item => item == player);

        thisPlayer.franchise_id = thisPlayer.franchise_id == teams.otherTeamID ? teams.currentTeamID : teams.otherTeamID;

        newTradablePlayers[thisPlayerIndex] = thisPlayer;
    });

    return newTradablePlayers
}

export const changePicksOwners = (offer, season, teams, picks) => {
    let newAllPicks = {...picks.newAllPicks};
    let newFuturePicks = {...picks.newFuturePicks};
    offer.map(pick => {
        let thisPick = pick;
        let thisPickIndex;

        thisPick.original_team_id = thisPick.current_team_id;
        thisPick.current_team_id = thisPick.current_team_id == teams.otherTeamID ? teams.currentTeamID : teams.otherTeamID;

        if(pick.season == season) {
            thisPickIndex = newAllPicks[pick.round].findIndex(item => item == pick);

            newAllPicks[pick.round][thisPickIndex] = thisPick;

        } else {
            thisPickIndex = newFuturePicks[pick.season][pick.round].findIndex(item => item == pick);

            newFuturePicks[pick.season][pick.round][thisPickIndex] = thisPick;
        }
    });
    return [newAllPicks, newFuturePicks]
}