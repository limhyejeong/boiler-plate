import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null) {

   function AuthenticationCheck(props) {

      const dispatch = useDispatch();

      useEffect(() => {

         dispatch(auth()).then(response => {
            console.log(response)

            // 로그인 하지 않은 상태
            if (!response.payload.isAuth) {
               if (option) { 
                  props.history.push('/login')
               }
            } else {
               // 로그인 한 상태
               if (adminRoute && !response.payload.isAdmin) {
                  props.history.push('/')
               } else { // 로그인한 유저가 출입 가능
                  if (option === false)
                     props.history.push('/')
               }
            }
         })

         // Axios.get('/api/users/auth')

      }, [])

      return (
         <SpecificComponent />
      )
   }

   return AuthenticationCheck

}