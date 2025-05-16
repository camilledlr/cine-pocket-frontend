import React from 'react';
import Menu from '../components/Menu';
import MainSearchBar from '../components/Home/MainSearchBar';
import NavBar from '../components/Common/NavBar';

function Home() {
  return (
    <div className="home">
      <NavBar/>
      <MainSearchBar/>
      <Menu />
    </div>
  );
}

export default Home;
