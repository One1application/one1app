import { useState } from "react";
import {
  Search,
  User,
  Send,
  Menu,
  X,
  Smile,
  MessageSquare,
} from "lucide-react";
import { contacts, randomReplies } from "./chatConfig";
import EmojiPicker from "emoji-picker-react";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleContactClick = (contact) => {
    setSelectedChat(contact);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const timestamp = new Date().toLocaleString();
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", text: message, timestamp },
      ]);
      setMessage("");

      setTimeout(() => {
        const randomReply =
          randomReplies[Math.floor(Math.random() * randomReplies.length)];
        const replyTimestamp = new Date().toLocaleString();
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: selectedChat.name,
            text: randomReply,
            timestamp: replyTimestamp,
          },
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiData) => {
    // Access the emoji character using emojiData.emoji
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setEmojiPickerVisible(false);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar for contacts */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Search header */}
          <div className="p-4 border-b bg-white sticky top-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contacts list */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                  selectedChat?.id === contact.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="relative">
                  {contact.img ? (
                    <img
                      src={contact.img}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                      contact.online ? "bg-green-500" : "bg-gray-300"
                    } border-2 border-white`}
                  ></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {contact.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Chat header */}
        <div className="h-16 border-b bg-white flex items-center px-4 sticky top-0 z-20">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden mr-4 hover:bg-gray-100 p-2 rounded-lg"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {selectedChat ? (
            <div className="flex items-center gap-3">
              {selectedChat.img ? (
                <img
                  src={selectedChat.img}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div>
                <h2 className="font-medium text-gray-900">
                  {selectedChat.name}
                </h2>
                <span className="text-sm text-gray-500">
                  {selectedChat.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ) : (
            <h2 className="font-medium text-gray-500">Select a conversation</h2>
          )}
        </div>

        {/* Messages area */}
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === "You" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] break-words ${
                      msg.sender === "You"
                        ? "bg-orange-500 text-white rounded-t-2xl rounded-bl-2xl"
                        : "bg-gray-200 text-gray-800 rounded-t-2xl rounded-br-2xl"
                    } px-4 py-2 shadow-sm`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Message input area */}
            <div className="border-t bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
                  >
                    <Smile className="w-6 h-6 text-gray-500" />
                  </button>

                  {/* Emoji picker */}
                  {emojiPickerVisible && (
                    <div className="absolute bottom-12 left-0 bg-white border rounded-lg shadow-lg p-2">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-2 rounded-full ${
                    message.trim()
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-200"
                  } transition-colors duration-150`}
                >
                  <Send
                    className={`w-6 h-6 ${
                      message.trim() ? "text-white" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Welcome to Chat
            </h3>
            <p className="text-gray-500">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
