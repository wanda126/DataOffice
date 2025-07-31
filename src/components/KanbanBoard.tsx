import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Consultation } from '../types';
import { Clock, AlertCircle, CheckCircle, XCircle, Calendar, User } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const { consultations, updateConsultationStatus } = useData();
  const { user } = useAuth();

  const columns = [
    { 
      id: 'analyzing', 
      title: 'En Análisis', 
      color: 'bg-yellow-100 border-yellow-200',
      icon: Clock,
      iconColor: 'text-yellow-600'
    },
    { 
      id: 'proposal', 
      title: 'En Propuesta', 
      color: 'bg-blue-100 border-blue-200',
      icon: AlertCircle,
      iconColor: 'text-blue-600'
    },
    { 
      id: 'delivered', 
      title: 'Entregada', 
      color: 'bg-green-100 border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    { 
      id: 'cancelled', 
      title: 'Cancelada', 
      color: 'bg-red-100 border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600'
    }
  ];

  const getConsultationsByStatus = (status: string) => {
    return consultations.filter(consultation => 
      consultation.status === status && 
      (user?.role === 'admin' || consultation.clientId === user?.id)
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const isDueSoon = (deadline: string) => {
    const due = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard de Consultas</h2>
        <p className="text-gray-600 mt-1">
          Seguimiento en tiempo real del estado de tus proyectos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const Icon = column.icon;
          const consultationsInColumn = getConsultationsByStatus(column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`rounded-lg border-2 ${column.color} p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${column.iconColor}`} />
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${column.color}`}>
                    {consultationsInColumn.length}
                  </span>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {consultationsInColumn.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No hay consultas en esta etapa</p>
                  </div>
                ) : (
                  consultationsInColumn.map((consultation) => (
                    <div
                      key={consultation.id}
                      className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(consultation.priority)} p-4 hover:shadow-md transition-shadow cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {consultation.title}
                        </h4>
                        {isDueSoon(consultation.deadline) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Urgente
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {consultation.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(consultation.deadline)}</span>
                        </div>
                        
                        {consultation.assignedAnalyst && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>Asignado</span>
                          </div>
                        )}
                      </div>

                      {user?.role === 'admin' && (
                        <div className="mt-3 flex space-x-1">
                          {columns.map((col) => 
                            col.id !== consultation.status && (
                              <button
                                key={col.id}
                                onClick={() => updateConsultationStatus(consultation.id, col.id as Consultation['status'])}
                                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                              >
                                → {col.title}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};