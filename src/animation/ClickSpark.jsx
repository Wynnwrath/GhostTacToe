import React, { useState, useEffect } from "react";
import "./ClickSpark.css"; 

const ClickSpark = ({
  sparkColor = "#fff",
  sparkSize = 30,
  sparkRadius = 50,
  sparkCount = 12,
  duration = 400,
  children,
}) => {
  const [sparks, setSparks] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSparks = Array.from({ length: sparkCount }).map((_, i) => {
      const angle = (i / sparkCount) * 2 * Math.PI;
      const tx = Math.cos(angle) * sparkRadius;
      const ty = Math.sin(angle) * sparkRadius;
      
      return {
        id: Date.now() + i,
        x,
        y,
        tx,
        ty,
        color: sparkColor,
      };
    });

    setSparks((prev) => [...prev, ...newSparks]);
  };

  useEffect(() => {
    if (sparks.length > 0) {
      const timer = setTimeout(() => {
        setSparks((prev) => prev.slice(sparkCount));
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [sparks, duration, sparkCount]);

  return (
    <div className="click-spark-container" onClick={handleClick}>
      {children}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="spark"
          style={{
            left: spark.x,
            top: spark.y,
            width: sparkSize,
            height: sparkSize,
            backgroundColor: spark.color,
            "--tx": `${spark.tx}px`,
            "--ty": `${spark.ty}px`,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default ClickSpark;