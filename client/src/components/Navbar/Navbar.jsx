import React from "react";

const Navbar = () => {
  return (
    <>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
          style={{ marginRight: "20px" }}
          width={140}
            src="https://cdn-icons-png.flaticon.com/512/3211/3211343.png"
            alt=""
          />
          <h4 style={{fontSize: 40}}>AUTH</h4>
        </div>
          <div>Регистрация</div>
          <div>Логин</div>
      </nav>
    </>
  );
};

export default Navbar;
