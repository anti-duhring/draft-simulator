export const compareOfferValue = (offerValues, isMyPick, forceTrade) => {
    if(forceTrade) return true

    let myOffer = 0;
    let botOffer = 0;

    if(isMyPick) {
        myOffer = offerValues.currentTeamOfferValue;
        botOffer = offerValues.otherTeamOfferValue;
    } else {
        myOffer = offerValues.otherTeamOfferValue;
        botOffer = offerValues.currentTeamOfferValue;
    }

    if(botOffer >= myOffer) {
        return 0
    } else if (myOffer > botOffer * 2) {
        return -1
    } else {
        return 1
    }
}

export const compareOfferValueInt = (offerValues, isMyPick, forceTrade) => {
    if(forceTrade) return true

    let myOffer = 0;
    let botOffer = 0;

    if(isMyPick) {
        myOffer = offerValues.currentTeamOfferValue;
        botOffer = offerValues.otherTeamOfferValue;
    } else {
        myOffer = offerValues.otherTeamOfferValue;
        botOffer = offerValues.currentTeamOfferValue;
    }

    if(botOffer >= myOffer) {
        return (myOffer * 100) / botOffer
    } else if (myOffer > botOffer * 2) {
        return ((botOffer * 2) * 100) / myOffer
    } else {
        return 100
    }
}