import jwtDecode from 'jwt-decode'
import { access } from './Access'
export default function AccessValidator(expectedRole) {


  const token = sessionStorage.getItem('token')
  if (token && token !== '') {
    try {
      const decoded = jwtDecode(token)
      if (decoded.role === 'user') {
        if(!decoded.is_active){
          return access.UNPAID;
        }
        return access.USER;
      }
      if (decoded.role === 'admin'){
        return access.ADMIN;
      }
    } catch {
      return access.NONE;
    }
  } else {
    return access.NONE;
  }
}
