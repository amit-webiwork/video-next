"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { Card, Modal, Button, Input, notification, Avatar } from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import Image from "next/image";

import VideoContext from "@/app/context/VideoContext";

export default function Video() {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    sendMsg: sendMsgFunc,
    msgRcv,
    chat,
    setChat,
    userName,
    myVdoStatus,
    screenShare,
    fullScreen,
    handleScreenSharing,
    userVdoStatus,
    updateVideo,
    myMicStatus,
    userMicStatus,
    updateMic,
  }: any = useContext(VideoContext);
  return (
    <>
      <div className="header">
        <nav id="nav">
          {/* <img src="https://i.postimg.cc/Sx0ZGtQJ/logo.png" className="logo" /> */}
          <ul>
            <li><img src="https://i.postimg.cc/L8zxQBhv/live.png" className="active" /></li>
            <li><img src="https://i.postimg.cc/JnggC78Q/video.png" /></li>
            <li><img src="https://i.postimg.cc/vmb3JgVy/message.png" /></li>
            <li><img src="https://i.postimg.cc/qR7Q7PwZ/notification.png" /></li>
            <li><img src="https://i.postimg.cc/k4DZH604/users.png" /></li>
            <li><img src="https://i.postimg.cc/v84Fqkyz/setting.png" /></li>
          </ul>
        </nav>

        <div className="container">
          <div className="top-icons">
            {/* <img src="https://i.postimg.cc/cCpcXrSV/search.png" />
            <img src="https://i.postimg.cc/Pqy2TXWw/menu.png" /> */}
          </div>
          {stream ? (
            <div className="row">
              <div className="col-1 text-center">
                <>
                  {myVdoStatus ? (
                    <video
                      playsInline
                      muted
                      onClick={fullScreen}
                      ref={myVideo}
                      autoPlay
                      className="video-active"
                    />
                  ) : (
                    <Image src="/user.jpg" alt="user" width={400} height={400} className="host-img" />
                  )}
                </>
                <div className="contarols">
                  <img src="https://i.postimg.cc/3NVtVtgf/chat.png" />
                  <img src="https://i.postimg.cc/BQPYHG0r/disconnect.png" />
                  <img src="https://i.postimg.cc/fyJH8G00/call.png" className="call-icon" />
                  <img src="https://i.postimg.cc/bJFgSmFY/mic.png" />
                  <img src="https://i.postimg.cc/Y2sDvCJN/cast.png" />
                </div>
              </div>
              <div className="col-2">
                <div className="joined">
                  <p>People Joined</p>
                  <div>
                    <img src="https://i.postimg.cc/WzFnG0QG/people-1.png" />
                    <img src="https://i.postimg.cc/fRhGbb92/people-2.png" />
                    <img src="https://i.postimg.cc/02mgxSbK/people-3.png" />
                    <img src="https://i.postimg.cc/K8rd3y7Z/people-4.png" />
                    <img src="https://i.postimg.cc/HWFGfzsC/people-5.png" />
                  </div>
                </div>
                <div className="invite">
                  <p>Invite More People</p>
                  <div>
                    <img src="https://i.postimg.cc/7LHjgQXS/user-1.png" />
                    <img src="https://i.postimg.cc/q71SQXZS/user-2.png" />
                    <img src="https://i.postimg.cc/h4kwCGpD/user-3.png" />
                    <img src="https://i.postimg.cc/GtyfL0hn/user-4.png" />
                    <img src="https://i.postimg.cc/FFd8gSbC/user-5.png" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bouncing-loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
        <style jsx>{`
          *{
            margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'poppins', sans-serif;
  
  }
          .header{
            width: 100%;
          height: 100vh;
          background: #00122e;
          position: relative;
  
  }
          nav{
            position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          background: #182842;
          width: 120px;
          padding: 10px 0;
  
  }
          nav .logo{
            width: 56px;
          display: block;
          margin: auto;
          cursor: pointer;
  }
          nav ul{
            margin-top: 160px;
  
  }
          nav ul li{
            list-style: none;
  
  }
          nav ul li img{
            width: 50px;
          display: block;
          margin: 10px auto;
          padding: 10px;
          cursor: pointer;
          opacity: 0.5;
          border-radius: 10px;
          transition: opacity 0.5s, background 0.5s;
  }
          nav ul li img:hover{
            opacity: 1;
          background: #4d6181;
  
  }
          .active{
            opacity: 1;
          background: #4d6181;
  }
          .container{
            margin-left: 120px;
          padding: 0 2.5%;
  
  }
          .top-icons{
            display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 25px 0;
  
  }
          .top-icons img{
            width: 25px;
          margin-left: 40px;
          cursor: pointer;
  
  }
          .row{
            margin-top: 15px;
          display: flex;
          justify-content: space-between;
  
  }
          .col-1{
            flex-basis: 65%;
  
  }
          .col-2{
            flex-basis: 33%;
  }
          .host-img{
            width: 100%;
          border-radius: 15px;
  }
          .contarols{
            display: flex;
          align-items: center;
          justify-content: center;
  }
          .contarols img{
            width: 40px;
          margin: 20px 10px;
          cursor: pointer;
          transition: transform 0.5s;
  }
          .contarols .call-icon{
            width: 70px;
  
  }
          .contarols img:hover{
            transform: translateY(-10px);
  
  }
          .joined{
            background: #182842;
          border-radius: 15px;
          padding: 30px 40px 50px;
          color: #fff;
  
  }
          .joined div{
            margin-top: 20px;
          display: grid;
          grid-template-columns: auto auto auto;
          grid-gap: 20px;
  
  }
          .joined img{
            width: 100%;
          border-radius: 10px;
          cursor: pointer;
  
  }
          .invite{
            background: #182842;
          border-radius: 15px;
          padding: 30px 40px 50px;
          color: #fff;
          margin-top: 20px;
  
  }
          .invite img{
            margin-top: 20px;
          width: 50px;
          margin-left: 5px;
          border-radius: 50%;
          cursor: pointer;
  }
  .text-center{
    text-align: center
  }
  @keyframes bouncing-loader {
    to {
      opacity: 0.1;
      transform: translate3d(0, -16px, 0);
    }
  }
  .bouncing-loader {
    display: flex;
    justify-content: center;
    margin: 5rem auto;
    border: 0px solid black;
  }
  
  .bouncing-loader > div {
    width: 16px;
    height: 16px;
    margin: 3rem 0.2rem;
    background: #fefefe;
    border-radius: 50%;
    animation: bouncing-loader 0.6s infinite alternate;
  }
  
  .bouncing-loader > div:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .bouncing-loader > div:nth-child(3) {
    animation-delay: 0.4s;
  }
        `}</style>
      </div>
    </>
  );
}