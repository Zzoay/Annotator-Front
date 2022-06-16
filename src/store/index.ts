
import {InjectionKey} from 'vue'
import {createStore, Store} from 'vuex'
import { User} from "@/types/common";


export interface State {
    user: User,
}

export const StateKey: InjectionKey<Store<State>> = Symbol();

export const SET_USER = 'setUser';
export const CLEAR_USER = 'clearUser'

export const initDefaultUserInfo = (): User => {
    let user: User = {
        id: 0,
        username: "",
        // avatar: "",
        email: '',
        nickname: '',
        is_superuser: false,
    }
    if (window.sessionStorage.userInfo) {
        user = JSON.parse(window.sessionStorage.userInfo);
    }
    return user
}

export const store = createStore<State>({
    state() {
        return {
            user: initDefaultUserInfo(),
        }
    },
    mutations: {
        setUser(state: object | any, userInfo: object | any) {
            for (const prop in userInfo) {
                state[prop] = userInfo[prop];
            }
        },
        clearUser(state: object | any) {
            state.user = initDefaultUserInfo();
        },
    },
})