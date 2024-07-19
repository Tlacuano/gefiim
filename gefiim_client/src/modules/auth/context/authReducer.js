import { types } from "../types/types"

export const authReducer = (state, action) => {
    switch (action.type) {
        case types.LOGIN:
            return {
                authInformation: action.payload,
                logged: true
            }
        case types.LOGOUT:
            return {
                ...state,
                logged: false
            }
        default:
            return state
    }
}