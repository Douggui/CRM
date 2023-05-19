import Axios from "axios";

/**4
 * deconnection (delete the token from the storage)
 */
export function  logout(){
    window.localStorage.removeItem('token');
    delete Axios.defaults.headers['Authorisation'];
}