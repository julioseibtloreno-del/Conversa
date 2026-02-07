
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        <div className={`text-[10px] mt-2 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
