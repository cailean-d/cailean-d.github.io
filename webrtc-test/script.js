let pc, peerStream
const localVideo = document.querySelector('#local-video')
const remoteVideo = document.querySelector('#remote-video')
const signalServer = new BroadcastChannel('a')
const constraintsx = { audio: true, video: true }
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ]
}

signalServer.onmessage = async function({data}) {
  const {description, candidate} = JSON.parse(data)
  if (description) {
    if (!pc) createPeerConnection()
    await pc.setRemoteDescription(description);
    if (description.type == 'offer') {
      if (!peerStream) await getMediaStream()
      await pc.setLocalDescription(await pc.createAnswer())
      signalServer.postMessage(JSON.stringify({description: pc.localDescription}))
    }
  } else if (candidate) {
    await pc.addIceCandidate(candidate);
  }
}

async function getMediaStream() {
  peerStream = await navigator.mediaDevices.getUserMedia(constraintsx)
  peerStream.getTracks().forEach(track => pc.addTrack(track, peerStream))
  localVideo.srcObject = peerStream
}

async function createAndSendOffer() {
  await pc.setLocalDescription(await pc.createOffer());
  addToHtml(pc.localDescription.sdp)
  signalServer.postMessage(JSON.stringify({description: pc.localDescription}))
}

function createPeerConnection() {
  pc = new RTCPeerConnection(configuration)
  pc.onicecandidate = ({candidate}) => {
    console.log('ice-candidate = ' + candidate)
    signalServer.postMessage(JSON.stringify({candidate}))
  }
  pc.onnegotiationneeded = async () => {
    console.log('--- negotiation')
    await createAndSendOffer()
  }
  pc.ontrack = ({streams}) => (!remoteVideo.srcObject && (remoteVideo.srcObject = streams[0]))
  pc.onremovetrack = e => console.log(e)
  pc.oniceconnectionstatechange = () => console.log('ice-connection = ' + pc.iceConnectionState)
  pc.onsignalingstatechange = () => console.log('signal-state = ' + pc.signalingState)
  pc.onicegatheringstatechange = () => console.log('ice-gathering-state = ' + pc.iceGatheringState)
  pc.onconnectionstatechange = () => console.log('connection-state = ' + pc.connectionState)
}

document.querySelector('#peer-call').onclick = async () => {
  createPeerConnection()
  if (!peerStream) await getMediaStream()
}
