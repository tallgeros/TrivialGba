import React from 'react';
import './categoryStatus.css';

export function CategoryStatus({ categories, playerCategories }) {
  return (
    <div style={{background:'#1a1a3e', color:'white', padding:16, borderRadius:10, marginBottom:16, width:400}}>
      <b>Quesitos Ganados:</b>
      {[1,2].map(p => (
        <div key={p} style={{display:'flex',alignItems:'center',margin:'6px 0'}}>
          <span style={{width:90}}>Jugador {p}:</span>
          {Object.keys(categories).map(catKey => {
            const has = playerCategories[p].includes(catKey);
            return (
              <span key={catKey} style={{
                display:'inline-flex',width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center',
                marginRight:5,
                background:has ? categories[catKey].color : '#444', fontSize:18
              }}>
                {has ? categories[catKey].emoji : '❌'}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
