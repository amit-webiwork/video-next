"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { Card, Modal, Button, Input, notification, Avatar } from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import Image from "next/image";
import "./Video.css";

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
                <video
                  playsInline
                  muted
                  onClick={fullScreen}
                  ref={myVideo}
                  autoPlay
                  className="video-active"
                  style={{
                    opacity: `${myVdoStatus ? "1" : "0"}`,
                  }}
                />
                <Image src="/user.jpg" alt="user" width={400} height={400} className="host-img" style={{ display: `${myVdoStatus ? "none" : "block"}` }} />
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
      </div>
    </>
  );
}