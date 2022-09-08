import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Button,
  Input,
} from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { toggleModal } from "../redux/reducer";

const ModalCall: React.FC = () => {
  const socket = io("http://localhost:5001" || "https://oh-mess.herokuapp.com");
  const myVideo: any = useRef(null);
  const userVideo: any = useRef(null);
  const connection: any = useRef(null);

  //state calling
  const dispatch = useAppDispatch();
  const [me, setMe] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [stream, setStream] = useState<any>();
  const [callerSignal, setCallerSignal] = useState<any>();
  const [caller, setCaller] = useState<string | undefined>("");
  const [isToCall, setIsToCall] = useState<string | undefined>("");
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean | undefined>(false);
  const isOpen: any = useAppSelector((state: any) => state.actionEvt.isOpen);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (!myVideo.current) return;
        myVideo.current!.srcObject = stream;
      })
      .catch((err) => console.log(err));

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  const callUser = (id: any) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", () => {
      userVideo.current!.srcObject = stream;
    });

    socket.on("callAccepted", (signal: any) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connection.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current!.srcObject = stream;
    });

    peer.signal(callerSignal);
    connection.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connection.current.destroy();
  };

  const handleCloseModal = () => {
    return dispatch(toggleModal(false));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={{ display: "flex", width: "auto" }}>
              <div>
                {stream && (
                  <video playsInline ref={myVideo} autoPlay width={"auto"} />
                )}
              </div>
              <div>
                {callAccepted && !callEnded ? (
                  <video playsInline ref={userVideo} autoPlay />
                ) : null}
              </div>
            </div>
            <>
              <FormControl>
                <FormLabel>Nick Name</FormLabel>
                <Input
                  placeholder="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  required
                />
                <FormLabel></FormLabel>
                <CopyToClipboard text={me}>
                  <Button style={{ width: "100%" }}>Get your ID call</Button>
                </CopyToClipboard>
                <FormLabel>ID call</FormLabel>
                <Input
                  placeholder="ID"
                  type="text"
                  value={isToCall}
                  onChange={(e) => setIsToCall(e.currentTarget.value)}
                  required
                />
                <FormLabel></FormLabel>
                {callAccepted && !callEnded ? (
                  <Button type="submit" onClick={leaveCall}>
                    End call
                  </Button>
                ) : (
                  <Button width="100%" onClick={() => callUser(isToCall)}>
                    Call now
                  </Button>
                )}
              </FormControl>
            </>
          </ModalBody>
          <ModalFooter>
            {receivingCall && !callAccepted ? (
              <>
                <Button width="100%" onClick={answerCall}>
                  {name.length > 5 ? `${name.substring(0, 5)}...` : name} is
                  calling
                </Button>
              </>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalCall;
