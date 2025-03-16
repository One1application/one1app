import {SET_USER, SET_SOCIALS, SET_HEADER, SET_LINKS} from "./constants.js"

export const reducer = (state, action) => {
    const { payload, type } = action;
   
    const handlers = {
        [SET_USER]: { ...state, user: payload },
        [SET_SOCIALS]: { ...state, socials: payload },
        [SET_HEADER]: { ...state, header: payload },
        [SET_LINKS]: { ...state, links: payload },

    };
    return handlers[type] || state;
};