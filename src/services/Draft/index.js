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

export const hasToGoToSecondRound = (currentPick, setCurrentRound, pick) => {
    if(currentPick==pick) setCurrentRound(2)
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