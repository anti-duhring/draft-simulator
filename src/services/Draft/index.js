import data from '../../data/draft_picks.json'
//import dataPicks from '../../data/picks.json'

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
    let needsAlreadyPicked = currentObject.allPicks.map(i => i.player_picked?.position)

    // Needs filtered excluding position of players that was already picked up
    let draftNeedsFiltered = currentTeamNeeds.map((need, index) => {
        for(let i = 0; i < positions[need].length; i++) {
            return positions[need][i]
        }
        
    }).filter(n => needsAlreadyPicked.indexOf(n) == -1)

    // If the team has no needs return the best player avaliable
    if(!currentTeamNeeds) {
       return allPlayers.filter(item => playersAlreadyChosed.indexOf(item.id)==-1)[0]
    }

    // Create value for each team need. First need has more value than second need and so on
    currentTeamNeeds.map((need, index) => {
        for(let i = 0; i < positions[need].length; i++) {
            needValues[positions[need][i]] = 100/(index + 1)
        }
        
    })

    const playersAvaliable = allPlayers.filter(item => playersAlreadyChosed.indexOf(item.id)==-1);

    const playersFilteredByNeedsAndADP = playersAvaliable.filter(p => p.adp <= currentObject.currentPick && draftNeedsFiltered.indexOf(p.position) != -1);

    // If there is at least one player who have an ADP less or equal than the currennt pick so pick the first player
    if(playersFilteredByNeedsAndADP.length) {

        playersFilteredByNeedsAndADP.sort((a, b) => a.adp - b.adp)

        return playersFilteredByNeedsAndADP[0]
    }

    // If there's not
    // Create a new array containing the player and his need value, which is based on what position this player are. 
    // Players in high positions has more value, because of that the value is based either on the "needValues" of his position and his index
    let playersValueList = playersAvaliable.map((player, index) => {
        if(draftNeedsFiltered.indexOf(player.position) != -1) {
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

    // Pick the best player
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

    if(currentPick==33) setCurrentRound(2)
}

export const hasToEndDraft = (currentPick, navigate) => {
    if(currentPick == 0) {
        setTimeout(() => navigate('/myDraft'), 1000)
    }
    
    return currentPick == 0 ? true : false
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

const pickSkeleton = ( NFLPick, season, pick) => {
    if(!NFLPick) {
        return null
        /*return {
            round: simulatorPick.round,
            pick: simulatorPick.pick,
            season: simulatorPick.season,
            original_team_id: simulatorPick.original_team_id,
            current_team_id: simulatorPick.current_team_id,
            pick_id: simulatorPick.pick_id,
        }*/
    }

    return {
        round: NFLPick.round,
        pick: pick,
        season: season,
        original_team_id: NFLPick.prev_team_id > 0 ? NFLPick.prev_team_id : NFLPick.current_team_id,
        current_team_id: NFLPick.current_team_id,
        pick_id: 1,
    }
}

export const syncSimulatorPicksWithNFLPicks = (config, NFLPicks) => {
    //const currentPicks = simulatorPicks;
    //const NFLPicks = dataPicks;
    const order = config.order;
    const season = config.season;
    const newNFLPicks = [
        ...NFLPicks[1], 
        ...NFLPicks[2], 
        ...NFLPicks[3],
        ...NFLPicks[4],
        ...NFLPicks[5],
        ...NFLPicks[6],
        ...NFLPicks[7]
    ]
    
    const newCurrentPicks = {
        "1": order.filter(i => NFLPicks[1].map(t => t.prev_team_id).indexOf(i.id) != -1).map((team, index) => {
            return pickSkeleton(newNFLPicks.find(p => p.round == 1 && p.prev_team_id == team.id), season, index + 1)
        }).filter(i => i) ,
        "2": order.filter(i => NFLPicks[2].map(t => t.prev_team_id).indexOf(i.id) != -1).map((team, index) => {
            return pickSkeleton(newNFLPicks.find(p => p.round == 2 && p.prev_team_id == team.id), season, (index + 1) + NFLPicks[1].map(i => i.prev_team_id).filter(i => i > 0).length)
        }).filter(i => i),
        "3": NFLPicks[3].map((pick, index) => {
            return {
                round: pick.round,
                pick: pick.pick,
                season: season,
                original_team_id: pick.prev_team_id > 0 ? pick.prev_team_id : pick.current_team_id,
                current_team_id: pick.current_team_id,
                pick_id: newNFLPicks.indexOf(pick),
            }
        }).filter(i => i),
        "4": NFLPicks[4].map((pick, index) => {
            return {
                round: pick.round,
                pick: pick.pick,
                season: season,
                original_team_id: pick.prev_team_id > 0 ? pick.prev_team_id : pick.current_team_id,
                current_team_id: pick.current_team_id,
                pick_id: newNFLPicks.indexOf(pick),
            }
        }).filter(i => i),
        "5": NFLPicks[5].map((pick, index) => {
            return {
                round: pick.round,
                pick: pick.pick,
                season: season,
                original_team_id: pick.prev_team_id > 0 ? pick.prev_team_id : pick.current_team_id,
                current_team_id: pick.current_team_id,
                pick_id: newNFLPicks.indexOf(pick),
            }
        }).filter(i => i),
        "6": NFLPicks[6].map((pick, index) => {
            return {
                round: pick.round,
                pick: pick.pick,
                season: season,
                original_team_id: pick.prev_team_id > 0 ? pick.prev_team_id : pick.current_team_id,
                current_team_id: pick.current_team_id,
                pick_id: newNFLPicks.indexOf(pick),
            }
        }).filter(i => i),
        "7": NFLPicks[7].map((pick, index) => {
            return {
                round: pick.round,
                pick: pick.pick,
                season: season,
                original_team_id: pick.prev_team_id > 0 ? pick.prev_team_id : pick.current_team_id,
                current_team_id: pick.current_team_id,
                pick_id: newNFLPicks.indexOf(pick),
            }
        }).filter(i => i),
    }
    //console.log(newCurrentPicks);

    return newCurrentPicks

    /*{
            round: pick.round,
            pick: pick.pick,
            season: pick.season,
            original_team_id: newNFLPicks[index].prev_team_id > 0? newNFLPicks[index].prev_team_id : pick.original_team_id,
            current_team_id: newNFLPicks[index].current_team_id,
            pick_id: pick.pick_id,
        }
    */
}

export const moveOnDraft = (setCurrentPick, allPicks, totalPicksToDraft, currentRound) => {
    setCurrentPick(prevPick => 
        prevPick == totalPicksToDraft ? 
            0 : 
            // This piece is to detect if the next pick is really the next cronological pick or if there was any pick between them that   the NFL excluded 
            /* allPicks[currentRound][prevPick].pick > prevPick + 1 ? 
            prevPick + 2 : prevPick + 1 */
            prevPick + 1
    );
}