"use client";

import React, { VideoHTMLAttributes, useContext, useEffect, useState, useRef } from "react";
import { Card, Modal, Button, Input, notification, Avatar } from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import Image from "next/image";
import "./Video.css";

import VideoContext from "@/app/context/VideoContext";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { message } from "antd";


const URL = "https://35ad-125-99-173-186.ngrok-free.app";
export const socket = io(URL);

export default function Video() {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<any>();
  const [chat, setChat] = useState([]);
  const [name, setName] = useState("");
  const [call, setCall] = useState<any>({});
  const [me, setMe] = useState("");
  const [userName, setUserName] = useState("");
  const [otherUser, setOtherUser] = useState<any>("");
  const [myVdoStatus, setMyVdoStatus] = useState(true);
  const [userVdoStatus, setUserVdoStatus] = useState();
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [userMicStatus, setUserMicStatus] = useState();
  const [msgRcv, setMsgRcv] = useState<any>("");
  const [screenShare, setScreenShare] = useState(false)

  const myVideo = useRef<any>(null);
  const userVideo = useRef<any>();
  const connectionRef = useRef<any>();
  const screenTrackRef = useRef<any>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream: any) => {
        setStream(currentStream);
        if (myVideo.current)
          myVideo.current.srcObject = currentStream;
      }).catch(err => console.error(err.message));
    if (localStorage.getItem("name")) {
      setName(localStorage?.getItem("name"));
    }
    socket.on("me", (id) => setMe(id));
    socket.on("endCall", () => {
      window.location.reload();
    });

    socket.on("updateUserMedia", ({ type, currentMediaStatus }: any) => {
      if (currentMediaStatus !== null) {
        switch (type) {
          case "video":
            setUserVdoStatus(currentMediaStatus);
            break;
          case "mic":
            setUserMicStatus(currentMediaStatus);
            break;
          default:
            setUserMicStatus(currentMediaStatus[0]);
            setUserVdoStatus(currentMediaStatus[1]);
            break;
        }
      }
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on("msgRcv", ({ name, msg: value, sender }) => {
      setMsgRcv({ value, sender });
      setTimeout(() => {
        setMsgRcv({});
      }, 2000);
    });
  }, [myVideo]);

  const answerCall = () => {
    setCallAccepted(true);
    setOtherUser(call.from);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: call.from,
        userName: name,
        type: "both",
        myMediaStatus: [myMicStatus, myVdoStatus],
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
    console.log(connectionRef.current);
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    setOtherUser(id);
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", ({ signal, userName }) => {
      setCallAccepted(true);
      setUserName(userName);
      peer.signal(signal);
      socket.emit("updateMyMedia", {
        type: "both",
        currentMediaStatus: [myMicStatus, myVdoStatus],
      });
    });

    connectionRef.current = peer;
    console.log(connectionRef.current);
  };

  const updateVideo = () => {
    setMyVdoStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "video",
        currentMediaStatus: !currentStatus,
      });
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const updateMic = () => {
    setMyMicStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "mic",
        currentMediaStatus: !currentStatus,
      });
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };


  //SCREEN SHARING 
  const handleScreenSharing = () => {

    if (!myVdoStatus) {
      message.error("Turn on your video to share the content", 2);
      return;
    }

    if (!screenShare) {
      const mediaDevices = navigator.mediaDevices as any;
      mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((currentStream) => {
          const screenTrack = currentStream.getTracks()[0];


          // replaceTrack (oldTrack, newTrack, oldStream);
          connectionRef.current.replaceTrack(
            connectionRef.current.streams[0]
              .getTracks()
              .find((track) => track.kind === 'video'),
            screenTrack,
            stream
          );

          // Listen click end
          screenTrack.onended = () => {
            connectionRef.current.replaceTrack(
              screenTrack,
              connectionRef.current.streams[0]
                .getTracks()
                .find((track) => track.kind === 'video'),
              stream
            );

            myVideo.current.srcObject = stream;
            setScreenShare(false);
          };

          myVideo.current.srcObject = currentStream;
          screenTrackRef.current = screenTrack;
          setScreenShare(true);
        }).catch((error) => {
          console.log("No stream for sharing")
        });
    } else {
      screenTrackRef.current.onended();
    }
  };

  //full screen
  const fullScreen = (e) => {
    const elem = e.target;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();
    socket.emit("endCall", { id: otherUser });
    window.location.reload();
  };

  const leaveCall1 = () => {
    socket.emit("endCall", { id: otherUser });
  };

  const sendMsg = (value) => {
    socket.emit("msgUser", { name, to: otherUser, msg: value, sender: name });
    let msg: any = {};
    msg.msg = value;
    msg.type = "sent";
    msg.timestamp = Date.now();
    msg.sender = name;
    setChat([...chat, msg]);
  };

  return (
    <>
      {console.log(stream, 'stream------------')}

      {/* <video
        playsInline
        muted
        onClick={fullScreen}
        ref={myVideo}
        src="https://www.w3schools.com/html/movie.mp4"
        autoPlay
        className="video-active"
        style={{
          opacity: `${myVdoStatus ? "1" : "0"}`,
        }}
      /> */}
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