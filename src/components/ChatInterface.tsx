import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Send, Paperclip, Search } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const { consultations, messages, addMessage, getConsultationMessages } = useData();
  const { user } = useAuth();
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userConsultations = consultations.filter(c => 
    user?.role === 'admin' || c.clientId === user?.id
  );

  const filteredConsultations = userConsultations.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = selectedConsultation 
    ? getConsultationMessages(selectedConsultation)
    : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConsultation || !user) return;

    addMessage({
      consultationId: selectedConsultation,
      senderId: user.id,
      senderName: user.name,
      content: messageInput.trim(),
      type: 'text'
    });

    setMessageInput('');

    // Simulate analyst response
    setTimeout(() => {
      addMessage({
        consultationId: selectedConsultation,
        senderId: 'analyst-1',
        senderName: 'María González',
        content: 'Gracias por tu mensaje. Estoy revisando tu consulta y te responderé pronto con más detalles.',
        type: 'text'
      });
    }, 2000);
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedConsultationData = consultations.find(c => c.id === selectedConsultation);

  return (
    <div className="h-full flex flex-col md:flex-row bg-white">
      {/* Conversations List */}
      <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Conversaciones</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar consultas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConsultations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No hay consultas disponibles</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConsultations.map((consultation) => {
                const isSelected = selectedConsultation === consultation.id;
                const consultationMessages = getConsultationMessages(consultation.id);
                const lastMessage = consultationMessages[consultationMessages.length - 1];
                
                return (
                  <button
                    key={consultation.id}
                    onClick={() => setSelectedConsultation(consultation.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {consultation.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        consultation.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' :
                        consultation.status === 'proposal' ? 'bg-blue-100 text-blue-800' :
                        consultation.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {consultation.status === 'analyzing' ? 'Análisis' :
                         consultation.status === 'proposal' ? 'Propuesta' :
                         consultation.status === 'delivered' ? 'Entregada' : 'Cancelada'}
                      </span>
                    </div>
                    
                    {lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage.senderName}: {lastMessage.content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Vence: {new Date(consultation.deadline).toLocaleDateString('es-ES')}
                      </span>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConsultation && selectedConsultationData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900">{selectedConsultationData.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Analista asignado: {selectedConsultationData.assignedAnalyst ? 'María González' : 'Sin asignar'}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No hay mensajes aún</p>
                  <p className="text-sm mt-1">Inicia la conversación con tu analista</p>
                </div>
              ) : (
                currentMessages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {!isOwnMessage && (
                          <p className="text-xs font-medium mb-1 opacity-75">
                            {message.senderName}
                          </p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium">Selecciona una consulta</p>
              <p className="text-sm mt-1">Elige una conversación para comenzar a chatear</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};