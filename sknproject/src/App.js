import React from 'react'
import './App.css'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Layout from './Layouts/Frmlayout'
import Frmlogn from './Content/Login/Frmlogin'
import iconLoanding from '../src/assets/Images/LOGO1.gif'


const loading = (
  <div style={{ textAlign: 'center', margin: '15%', padding: 50 }}>
    <img src={iconLoanding} alt="Avatar" /><br />
    <span>Loanding...</span>
  </div>
)

function App() {
  return (
    <div className="page-wrapper" style={{ fontFamily: 'Kanit' }}>
      {

        sessionStorage.getItem('sessuserID') != null ? (
          <>
            <HashRouter>
              <React.Suspense fallback={loading}>

                <Switch>
                  <Route path="/" name="Home" render={props => <Layout {...props} />} />
                </Switch>

              </React.Suspense>
            </HashRouter>
          </>
        ) : (
          <>
            <Frmlogn />
          </>
        )

      }
    </div>
  );
}

export default App;
