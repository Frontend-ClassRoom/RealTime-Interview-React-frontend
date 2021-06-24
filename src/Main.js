import io from "socket.io-client";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const socket = io.connect("/");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

const Main = ({ roomId }) => {
  const videoRef = useRef(null);
  let peers;

  console.log("front roomId", roomId, peers);

  myPeer.on("open", (id) => {
    console.log("peer id", id);
    socket.emit("join-room", roomId, id);
  });

  socket.on("user-connected", (userId) => {
    console.log("user connected", userId);
  });

  useEffect(() => {
    fetch(`/api/${roomId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => console.log(response));
  }, [roomId]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);

        myPeer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            console.log("userStream", userVideoStream.length);
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });
  }, []);

  const myVideo = document.createElement("video");
  myVideo.muted = true;

  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });

    peers[userId] = call;
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoRef.current?.append(video);
  }

  return (
    <>
      <VideoGrid ref={videoRef} />
    </>
  );
};
export default Main;

const VideoGrid = styled.div`
  video {
    width: 400px;
    display: inline-block;
  }
`;
