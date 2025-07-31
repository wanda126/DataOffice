import React from 'react';
import { ServiceRecommendation } from '../types';
import { Check, Star, ArrowRight } from 'lucide-react';

interface ServiceRecommendationsProps {
  maturityLevel: number;
  freeConsultationsUsed: number;
}

export const ServiceRecommendations: React.FC<ServiceRecommendationsProps> = ({
  maturityLevel,
  freeConsultationsUsed
}) => {
  const getRecommendations = (level: number): ServiceRecommendation[] => {
    if (level <= 2) {
      return [
        {
          title: 'Diagnóstico Digital Básico',
          description: 'Evaluación completa de tu estado actual y roadmap de transformación',
          price: 'Gratis',
          features: [
            'Análisis de madurez digital',
            'Identificación de oportunidades',
            'Plan de acción básico',
            'Recomendaciones prioritarias'
          ],
          recommended: true
        },
        {
          title: 'Implementación de Dashboards',
          description: 'Creación de dashboards básicos para visualizar tus KPIs principales',
          price: '$299/mes',
          features: [
            'Hasta 5 dashboards',
            'Conexión a 3 fuentes de datos',
            'Actualización automática',
            'Soporte por email'
          ],
          recommended: false
        }
      ];
    } else if (level <= 3.5) {
      return [
        {
          title: 'Análisis Predictivo',
          description: 'Modelos de machine learning para predecir tendencias y comportamientos',
          price: '$599/mes',
          features: [
            'Modelos predictivos personalizados',
            'Análisis de churn y retención',
            'Forecasting de ventas',
            'Alertas automáticas'
          ],
          recommended: true
        },
        {
          title: 'Optimización de Procesos',
          description: 'Identificación y mejora de procesos mediante análisis de datos',
          price: '$899/mes',
          features: [
            'Análisis de eficiencia operativa',
            'Identificación de cuellos de botella',
            'Recomendaciones de mejora',
            'Seguimiento de KPIs'
          ],
          recommended: false
        }
      ];
    } else {
      return [
        {
          title: 'IA Avanzada y Automatización',
          description: 'Implementación de soluciones de IA para automatizar decisiones',
          price: '$1,299/mes',
          features: [
            'Modelos de IA personalizados',
            'Automatización de decisiones',
            'Análisis en tiempo real',
            'Integración con sistemas existentes'
          ],
          recommended: true
        },
        {
          title: 'Consultoría Estratégica',
          description: 'Asesoramiento estratégico para maximizar el valor de tus datos',
          price: '$2,499/mes',
          features: [
            'Estrategia de datos personalizada',
            'Roadmap de transformación',
            'Capacitación del equipo',
            'Soporte dedicado'
          ],
          recommended: false
        }
      ];
    }
  };

  const recommendations = getRecommendations(maturityLevel);
  const hasFreeCreditLeft = freeConsultationsUsed < 2;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Servicios Recomendados para Ti
        </h3>
        <p className="text-gray-600">
          Basado en tu nivel de madurez digital ({maturityLevel.toFixed(1)}/5)
        </p>
      </div>

      {hasFreeCreditLeft && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">¡Oferta Especial!</h4>
          </div>
          <p className="text-green-700 text-sm">
            Te quedan <strong>{2 - freeConsultationsUsed} consultas gratuitas</strong> para probar nuestros servicios.
            Aprovecha esta oportunidad para experimentar la calidad de nuestro análisis.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((service, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-lg border-2 p-6 ${
              service.recommended 
                ? 'border-blue-500 shadow-lg' 
                : 'border-gray-200 shadow-sm'
            }`}
          >
            {service.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Recomendado
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {service.title}
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                {service.description}
              </p>
              <div className="text-2xl font-bold text-blue-600">
                {service.price}
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
                service.recommended
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>Solicitar Consulta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          ¿Necesitas algo diferente? 
          <button className="text-blue-600 hover:text-blue-500 ml-1 font-medium">
            Contáctanos para una propuesta personalizada
          </button>
        </p>
      </div>
    </div>
  );
};