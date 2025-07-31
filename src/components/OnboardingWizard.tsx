import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MaturityAssessment } from '../types';
import { ChevronRight, ChevronLeft, Building, Users, BarChart, Database, Brain } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const maturityQuestions = [
  {
    id: 'dataGovernance',
    title: 'Gobierno de Datos',
    question: '¿Cómo describirías el estado actual del gobierno de datos en tu empresa?',
    icon: Database,
    options: [
      { value: 1, label: 'No tenemos políticas de datos definidas' },
      { value: 2, label: 'Tenemos algunas políticas básicas' },
      { value: 3, label: 'Políticas definidas pero no completamente implementadas' },
      { value: 4, label: 'Políticas implementadas y monitoreadas' },
      { value: 5, label: 'Gobierno de datos maduro y optimizado' }
    ]
  },
  {
    id: 'analyticsCapability',
    title: 'Capacidad Analítica',
    question: '¿Qué tan avanzadas son las capacidades analíticas de tu organización?',
    icon: BarChart,
    options: [
      { value: 1, label: 'Solo reportes básicos' },
      { value: 2, label: 'Algunos dashboards y métricas' },
      { value: 3, label: 'Análisis predictivo básico' },
      { value: 4, label: 'Análisis avanzado y machine learning' },
      { value: 5, label: 'IA y análisis en tiempo real' }
    ]
  },
  {
    id: 'technologyInfrastructure',
    title: 'Infraestructura Tecnológica',
    question: '¿Cómo evaluarías tu infraestructura tecnológica para datos?',
    icon: Building,
    options: [
      { value: 1, label: 'Sistemas legacy sin integración' },
      { value: 2, label: 'Algunos sistemas integrados' },
      { value: 3, label: 'Plataforma de datos centralizada básica' },
      { value: 4, label: 'Infraestructura cloud y moderna' },
      { value: 5, label: 'Arquitectura de datos completamente optimizada' }
    ]
  },
  {
    id: 'dataLiteracy',
    title: 'Alfabetización de Datos',
    question: '¿Cuál es el nivel de alfabetización de datos en tu equipo?',
    icon: Brain,
    options: [
      { value: 1, label: 'Muy limitado, pocos entienden los datos' },
      { value: 2, label: 'Conocimiento básico en algunas áreas' },
      { value: 3, label: 'Competencia moderada en datos' },
      { value: 4, label: 'Buen nivel de alfabetización' },
      { value: 5, label: 'Cultura de datos muy desarrollada' }
    ]
  },
  {
    id: 'businessAlignment',
    title: 'Alineación con el Negocio',
    question: '¿Qué tan alineados están los datos con los objetivos de negocio?',
    icon: Users,
    options: [
      { value: 1, label: 'Sin alineación clara' },
      { value: 2, label: 'Alineación básica' },
      { value: 3, label: 'Algunos KPIs conectados al negocio' },
      { value: 4, label: 'Métricas alineadas con estrategia' },
      { value: 5, label: 'Datos como ventaja competitiva' }
    ]
  }
];

export const OnboardingWizard: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [companyInfo, setCompanyInfo] = useState({
    company: '',
    role: '',
    employees: ''
  });

  const totalSteps = maturityQuestions.length + 2; // Company info + completion

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate maturity level
      const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length;
      
      const assessment: MaturityAssessment = {
        dataGovernance: answers.dataGovernance || 0,
        analyticsCapability: answers.analyticsCapability || 0,
        technologyInfrastructure: answers.technologyInfrastructure || 0,
        dataLiteracy: answers.dataLiteracy || 0,
        businessAlignment: answers.businessAlignment || 0
      };

     
      
     const handleFinish = async () => {
  ...
  if (user) {
    await updateProfile({
      maturity_level: avgScore,
      maturity_assessment: assessment,
      company: companyInfo.company || user.company
    });
  }
};

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return companyInfo.company && companyInfo.role && companyInfo.employees;
    }
    if (currentStep <= maturityQuestions.length) {
      const questionId = maturityQuestions[currentStep - 1]?.id;
      return questionId ? answers[questionId] : false;
    }
    return true;
  };

  const getMaturityLevel = () => {
    const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / Object.values(answers).length;
    if (avgScore <= 2) return { level: 'Inicial', color: 'text-red-600', description: 'Tu empresa está en las primeras etapas de la transformación digital' };
    if (avgScore <= 3.5) return { level: 'En Desarrollo', color: 'text-yellow-600', description: 'Tienes una base sólida pero hay oportunidades de mejora' };
    return { level: 'Avanzado', color: 'text-green-600', description: 'Tu empresa tiene capacidades analíticas maduras' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Paso {currentStep + 1} de {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Welcome Step */}
        {currentStep === 0 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Bienvenido a DataConsult!
            </h1>
            <p className="text-gray-600 mb-8">
              Cuéntanos un poco sobre tu empresa para personalizar tu experiencia
            </p>

            <div className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la empresa
                </label>
                <input
                  type="text"
                  value={companyInfo.company}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Innovación SA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu rol en la empresa
                </label>
                <select
                  value={companyInfo.role}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona tu rol</option>
                  <option value="ceo">CEO/Gerente General</option>
                  <option value="cto">CTO/Director de Tecnología</option>
                  <option value="data">Responsable de Datos</option>
                  <option value="marketing">Marketing/Ventas</option>
                  <option value="operations">Operaciones</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño de la empresa
                </label>
                <select
                  value={companyInfo.employees}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, employees: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona el tamaño</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-1000">201-1000 empleados</option>
                  <option value="1000+">Más de 1000 empleados</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Maturity Questions */}
        {currentStep > 0 && currentStep <= maturityQuestions.length && (
          <div>
            {(() => {
              const question = maturityQuestions[currentStep - 1];
              const Icon = question.icon;
              
              return (
                <div className="text-center">
                  <div className="mb-6">
                    <Icon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {question.title}
                    </h2>
                    <p className="text-gray-600">
                      {question.question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(question.id, option.value)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          answers[question.id] === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            answers[question.id] === option.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[question.id] === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                            )}
                          </div>
                          <span className="text-gray-900">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Completion Step */}
        {currentStep === totalSteps - 1 && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Evaluación Completada!
              </h2>
              
              {(() => {
                const maturity = getMaturityLevel();
                return (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Nivel de Madurez Digital: 
                      <span className={`ml-2 ${maturity.color}`}>
                        {maturity.level}
                      </span>
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {maturity.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {maturityQuestions.map((q) => (
                        <div key={q.id} className="flex justify-between">
                          <span>{q.title}:</span>
                          <span className="font-medium">{answers[q.id]}/5</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              
              <p className="text-gray-600">
                Basándome en tu evaluación, hemos personalizado nuestras recomendaciones
                para ayudarte a avanzar en tu transformación digital.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps - 1 ? 'Comenzar' : 'Siguiente'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
