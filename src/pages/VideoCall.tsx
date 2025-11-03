import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, Phone, Settings, Users, MessageSquare, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function VideoCall() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{ user: string, message: string, timestamp: Date }>>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    startCall();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsConnected(true);
      toast.success('Connected to video call');
    } catch (error) {
      toast.error('Failed to access camera/microphone');
      console.error('Error accessing media devices:', error);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    toast.success('Call ended');
    navigate('/telemedicine');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        user: user?.name || 'Anonymous',
        message: newMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Video Call</h1>
          <p className="text-sm text-gray-300">Room ID: {roomId}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex relative">
        {/* Main Video */}
        <div className="flex-1 relative bg-gray-800">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">Waiting for participants...</p>
                <p className="text-sm text-gray-400 mt-2">Share the room ID with participants</p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-700 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-gray-900">{msg.user}</div>
                  <div className="text-gray-600">{msg.message}</div>
                  <div className="text-xs text-gray-400">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
          
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          
          <button
            onClick={endCall}
            className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
          >
            <Phone className="h-5 w-5" />
          </button>
          
          <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}