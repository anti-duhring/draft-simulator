import { createContext } from "react";
import { useState, useEffect } from "react";
import data from '../../data/draft_picks.json'
import dataPlayers from '../../data/players.json'
import { getFuturePicks, getPicks, scrollToPick } from "../../services/Draft";
import { compareOfferValue } from "../../services/Trade";
import Alert from '../../components/Alert';

export const DraftContext = createContext();

export const DraftContextProvider = ({children}) => {
    const NFLseason = 2023;
    const [waitToPick, setWaitToPick] = useState(500)
    const [step, setStep] = useState('order');
    const [rounds, setRounds] = useState(1);
    const [draftOrder, setDraftOrder] = useState(data.teams);
    const [myTeams, setMyTeams] = useState([]);

    const [currentPick, setCurrentPick] = useState(1);
    const [picksPlayers, setPicksPlayers] = useState([]);

    const [allPicks, setAllPicks] = useState(null);
    const [futurePicks, setFuturePicks] = useState(null);
    const [tradablePlayers, setTradablePlayers] = useState(null);
    const [tradeHistory, setTradeHistory] = useState([]);

    const [alert, setAlert] = useState({
        active: false,
        message: '',
        title: '',
    })
    const [isJumpingTo, setIsJumpingTo] = useState(false)
    
    const MyPicks = () => {
        const myPicks = [];
        for(let i = 1; i <= 7; i++) {
            allPicks[i].map(pick => {
                if(myTeams.indexOf(pick.current_team_id)!=-1) {
                    myPicks.push(pick.pick)
                }
            })
        }
        return myPicks
    }

    const isMyPick = () => {
        return MyPicks().indexOf(currentPick)!=-1
    }

    const handleOfferTrade = (otherTeamOffer, otherTeamID, currentTeamOffer, currentTeamID, offerValues) => {
        let newAllPicks = {...allPicks};
        let newFuturePicks = {...futurePicks};
        let newTradablePlayers = [...tradablePlayers];
        const tradeResume = {
            id: tradeHistory.length + 1,
            teams_involved: [otherTeamID, currentTeamID],
            assets_received_1: {
                prev_owner: otherTeamID,
                current_owner: currentTeamID,
                assets: [...otherTeamOffer]
            },
            assets_received_2: {
                prev_owner: currentTeamID,
                current_owner: otherTeamID,
                assets: [...currentTeamOffer]
            }
        };

        // IF THE BOT TEAM OFFER IS TOO HIGH
        if(compareOfferValue(offerValues, isMyPick())==0) {
            setAlert({
                active: true, 
                title: `A proposta foi rejeitada pelo GM do ${isMyPick() ? data.teams.find(i => i.id==otherTeamID).nickname : data.teams.find(i => i.id==currentTeamID).nickname}`, 
                message:`O valor da sua oferta foi muito baixo, tente incrementá-lo com algumas picks ou adicionar jogadores na negociação.`
        })
            return
        }
        // IF THE USER'S TEAM OFFER IS TOO HIGH
        else if(compareOfferValue(offerValues, isMyPick()) == -1) {
            setAlert({
                active: true, 
                title: `Oferta muito alta!`, 
                message:`Sua oferta foi muito alta, isso talvez enfureça sua torcida e o dono do time. Retome as negociações com um valor um pouco mais baixo.`
            })
            return
        }

        // CHANGE THE PICK'S OWNER
        [...otherTeamOffer.filter(item => item.player_id), ...currentTeamOffer.filter(item => item.player_id)].map(player => {
            let thisPlayer = {...player};
            let thisPlayerIndex = newTradablePlayers.findIndex(item => item == player);

            thisPlayer.franchise_id = thisPlayer.franchise_id == otherTeamID ? currentTeamID : otherTeamID;

            newTradablePlayers[thisPlayerIndex] = thisPlayer;
        });

        // CHANGE THE PLAYER'S OWNER
        [...otherTeamOffer.filter(item => !item.player_id),...currentTeamOffer.filter(item => !item.player_id)].map(pick => {
            let thisPick = pick;
            let thisPickIndex;

            thisPick.original_team_id = thisPick.current_team_id;
            thisPick.current_team_id = thisPick.current_team_id == otherTeamID ? currentTeamID : otherTeamID;

            if(pick.season == NFLseason) {
                thisPickIndex = newAllPicks[pick.round].findIndex(item => item == pick);

                newAllPicks[pick.round][thisPickIndex] = thisPick;

            } else {
                thisPickIndex = newFuturePicks[pick.season][pick.round].findIndex(item => item == pick);

                newFuturePicks[pick.season][pick.round][thisPickIndex] = thisPick;
            }
        });
        setAllPicks(prevAllPicks => newAllPicks);
        setFuturePicks(prevFuturePicks => newFuturePicks);
        setTradablePlayers(newTradablePlayers);
        setTradeHistory(prevHistory => ([...prevHistory,tradeResume]))
    }

    const getPicksFromTeam = (id) => {
        const myPicks = [];
        Object.entries(allPicks).map(item => {
            const picksFromThisRound = item[1].filter(pick => pick.current_team_id == id);

            myPicks.push(...picksFromThisRound)
        })
        Object.entries(futurePicks).map(item => {
            let picksFromThisSeason = []
            for(let i = 1; i<=7; i++) {
                picksFromThisSeason.push(...item[1][i].filter(pick => pick.current_team_id == id))
            }
            myPicks.push(...picksFromThisSeason)
        });

        //myPicks.sort((a, b) => a.pick - b.pick)

        return myPicks
    }

    const handleDraftOrder = (order, myTeams, config) => {
        setStep('picks');
        setDraftOrder(order);
        setMyTeams(myTeams);
        setRounds(config.rounds)

        const picks = {
            "1": getPicks(order, 1, NFLseason),
            "2": getPicks(order, 2, NFLseason),
            "3": getPicks(order, 3, NFLseason),
            "4": getPicks(order, 4, NFLseason),
            "5": getPicks(order, 5, NFLseason),
            "6": getPicks(order, 6, NFLseason),
            "7": getPicks(order, 7, NFLseason),
        }

        const f_picks = {}
        f_picks[NFLseason + 1] =  getFuturePicks(order, NFLseason + 1);
        f_picks[NFLseason + 2] =  getFuturePicks(order, NFLseason + 2);

        setAllPicks(picks);
        setFuturePicks(f_picks);
        setTradablePlayers(data.tradable_players);

      }

    const pickPlayer = (player, _current_pick) => {
        const current_pick = _current_pick || currentPick;
        let newAllPicks = {...allPicks}
        newAllPicks[1][current_pick - 1].player_picked = {...player}
        setPicksPlayers(prevPicks => prevPicks ? ([...prevPicks,player.id]) : ([player.id]));
        setAllPicks(newAllPicks);
    }

    const handleDraftPlayer = (player) => {
        setCurrentPick(prevPick => prevPick == 32 ? 0 : prevPick + 1);
        pickPlayer(player)
    }

    const handleNextPick = () => {
        setCurrentPick(prevPick => prevPick == 32 ? 0 : prevPick + 1);

        if(picksPlayers.length <= 0) {
            pickPlayer(dataPlayers.players[0]);
            //setPicksPlayers([dataPlayers.players[0].id])
        } else {
            const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1);

            //setPicksPlayers(prevPicks => ([...prevPicks,playersAvaliable[0].id]));
            pickPlayer(playersAvaliable[0]);
        }
    }

    const handleMyNextPick = () => {
        if(currentPick >= draftOrder.length) return

        const MyNextPick = allPicks[1].find(item => myTeams.indexOf(item.current_team_id) != -1 && item.pick > currentPick);
        let i = currentPick - 1;
        let newPlayers = [];
        setIsJumpingTo(true);

        // Loop until MyNextPick or until the last pick
        const loop = (loopUntil) => {        
            i++;

            if(i < loopUntil) {
                setCurrentPick(i);

                const playersAvaliable = dataPlayers.players.filter(item => picksPlayers.indexOf(item.id)==-1 && newPlayers.indexOf(item.id) == -1);
                const playerToDraft = playersAvaliable[0];

                pickPlayer(playerToDraft, i);
                newPlayers.push(playerToDraft.id);

                scrollToPick(i > 1 ? i - 1 : 1)
                setTimeout(() => loop(loopUntil), waitToPick);
                
            } else {
                setIsJumpingTo(false)

                if(!MyNextPick) {
                    setCurrentPick(0);
                    scrollToPick(32)
                    
                } else {
                    setCurrentPick(MyNextPick.pick);
                    scrollToPick(MyNextPick.pick)
                }
            }
        }

        if(MyNextPick) {
            loop(MyNextPick.pick);
        }
        else if(!MyNextPick) {
            loop(33);
        }
        
    }

    return ( 
        <DraftContext.Provider value={{
            step, 
            setStep, 
            draftOrder,
            setDraftOrder,
            myTeams,
            setMyTeams,
            currentPick,
            setCurrentPick,
            picksPlayers,
            setPicksPlayers,
            MyPicks,
            isMyPick,
            allPicks,
            tradeHistory,
            NFLseason,
            tradablePlayers,
            isJumpingTo,
            rounds,
            handleDraftOrder,
            handleDraftPlayer,
            handleNextPick,
            handleMyNextPick,
            handleOfferTrade,
            getPicksFromTeam,
            }}>
                <Alert alert={alert} />
            {children}
        </DraftContext.Provider>
     );
}