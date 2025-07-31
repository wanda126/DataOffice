import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Consultation, Message, Proposal } from '../types';

interface DataContextType {
  consultations: Consultation[];
  messages: Message[];
  createConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConsultationStatus: (id: string, status: Consultation['status']) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  getConsultationMessages: (consultationId: string) => Message[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: '1',
      clientId: '1',
      title: 'Customer Churn Analysis',
      description: 'Need help analyzing customer retention patterns and identifying at-risk customers.',
      status: 'analyzing',
      priority: 'high',
      deadline: '2025-02-15',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      assignedAnalyst: 'analyst-1'
    },
    {
      id: '2',
      clientId: '1',
      title: 'Sales Performance Dashboard',
      description: 'Create a comprehensive dashboard to track sales KPIs and team performance.',
      status: 'proposal',
      priority: 'medium',
      deadline: '2025-02-20',
      createdAt: '2025-01-10T14:00:00Z',
      updatedAt: '2025-01-18T09:00:00Z',
      assignedAnalyst: 'analyst-2'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      consultationId: '1',
      senderId: 'analyst-1',
      senderName: 'María González',
      content: 'Hola! He recibido tu consulta sobre análisis de churn. ¿Podrías proporcionar más detalles sobre el período de tiempo que quieres analizar?',
      timestamp: '2025-01-15T11:00:00Z',
      type: 'text'
    },
    {
      id: '2',
      consultationId: '1',
      senderId: '1',
      senderName: 'Demo User',
      content: 'Por favor analiza los últimos 12 meses. Tengo los datos en formato CSV.',
      timestamp: '2025-01-15T11:30:00Z',
      type: 'text'
    }
  ]);

  const createConsultation = (consultationData: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newConsultation: Consultation = {
      ...consultationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConsultations(prev => [newConsultation, ...prev]);
  };

  const updateConsultationStatus = (id: string, status: Consultation['status']) => {
    setConsultations(prev => 
      prev.map(consultation => 
        consultation.id === id 
          ? { ...consultation, status, updatedAt: new Date().toISOString() }
          : consultation
      )
    );
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const getConsultationMessages = (consultationId: string) => {
    return messages.filter(message => message.consultationId === consultationId);
  };

  const value = {
    consultations,
    messages,
    createConsultation,
    updateConsultationStatus,
    addMessage,
    getConsultationMessages
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};