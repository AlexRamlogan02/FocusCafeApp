import {sessions} from "./session";

export async function startSession(){
    return Promise.resolve(sessions[0]);
}