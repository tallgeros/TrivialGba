import React from "react";
import "./player.css";

export function Player({ player, position, color, offset = 0 }) {
  return (
    <div
      style={{
        left: position.x + offset,
        top: position.y + offset,
        background: color,
        position: "absolute",
        borderRadius: "50%",
        width: 22,
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        border: "2px solid #fff",
        fontWeight: "bold",
        fontSize: 12,
        boxShadow: "0 1px 4px 0 #0004",
      }}
    >
      {player}
    </div>
  );
}
