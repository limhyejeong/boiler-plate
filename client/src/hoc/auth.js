import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null) {

   function AuthenticationCheck(props) {

      const dispatch = useDispatch();

      useEffect(() => {

         dispatch(auth())

         Axios.get('/api/users/auth')

      }, [])

   }

   return AuthenticationCheck

}