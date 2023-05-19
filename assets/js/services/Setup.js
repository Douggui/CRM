import Axios from "axios";
import jwtDecode from "jwt-decode";
import { logout } from "./Logout";

/**
 * store the token in Axios
 */
export  function setup(){
    const token = window.localStorage.getItem('token');

    if(token){
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime()){
            Axios.defaults.headers['Authorization'] = `Bearer ${token}`

        }
    }
}
/**
 * verify if the user is authenticated and store the token in Axios
 * @returns boolean
 */
export function isUserAuthenticated(){
    const token = window.localStorage.getItem('token');

    if(token){
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime()){
            Axios.defaults.headers['Authorization'] = `Bearer ${token}`
        }
        return false
    }
    return false
}