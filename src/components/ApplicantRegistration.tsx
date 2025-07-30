import React, { useState, useEffect } from 'react';
import { 
  User, 
  Search, 
  Home, 
  Phone, 
  Smartphone, 
  Building, 
  CheckSquare, 
  FileText, 
  Briefcase,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  PlusCircle
} from 'lucide-react';

interface VerificationData {
  cedula_identidad: string;
  complemento: string;
  expedicion: string;
}

interface ApplicantData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  gradoInstruccion: string;
  carrera: string;
  ciudad: string;
  zona: string;
  calleAvenida: string;
  numeroDomicilio: string;
  email: string;
  celular: string;
  marcaCelular: string;
  modeloCelular: string;
  tipoPostulacion: string;
  idRecinto: string;
  nombreRecinto: string;
  municipioRecinto: string;
  viveCercaRecinto: boolean;
  experienciaEspecifica: string;
  nroDeProcesos: string;
  requisitos: {
    esBoliviano: boolean;
    registradoPadronElectoral: boolean;
    cedulaIdentidadVigente: boolean;
    disponibilidadTiempoCompleto: boolean;
    celularConCamara: boolean;
    android8_2OSuperior: boolean;
    lineaEntel: boolean;
    ningunaMilitanciaPolitica: boolean;
    sinConflictosInstitucion: boolean;
    cuentaConPowerBank: boolean;
  };
  archivo_ci: File | null;
  archivo_no_militancia: File | null;
  curriculum: File | null;
  capturaPantalla: File | null;
}

const serializeFile = (file: File | null): string | null => {
  if (!file) return null;
  return JSON.stringify({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  });
};

const deserializeFile = (serialized: string | null): File | null => {
  if (!serialized) return null;
  try {
    const { name, size, type, lastModified } = JSON.parse(serialized);
    return new File([], name, { type, lastModified });
  } catch {
    return null;
  }
};

const ApplicantRegistration: React.FC = () => {
  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('applicantRegistrationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.formData) {
          parsedData.formData.archivo_ci = deserializeFile(parsedData.formData.archivo_ci);
          parsedData.formData.archivo_no_militancia = deserializeFile(parsedData.formData.archivo_no_militancia);
          parsedData.formData.curriculum = deserializeFile(parsedData.formData.curriculum);
          parsedData.formData.capturaPantalla = deserializeFile(parsedData.formData.capturaPantalla);
        }
        return parsedData;
      } catch (e) {
        console.error('Failed to parse saved data', e);
        return null;
      }
    }
    return null;
  };

  const savedState = loadFromLocalStorage();
  
  const [currentStep, setCurrentStep] = useState<'verification' | 'registration'>(savedState?.currentStep || 'verification');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData>(savedState?.verificationData || {
    cedula_identidad: '',
    complemento: '',
    expedicion: ''
  });

  const [formData, setFormData] = useState<ApplicantData>(savedState?.formData || {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    gradoInstruccion: '',
    carrera: '',
    ciudad: '',
    zona: '',
    calleAvenida: '',
    numeroDomicilio: '',
    email: '',
    celular: '',
    marcaCelular: '',
    modeloCelular: '',
    tipoPostulacion: '',
    idRecinto: '',
    nombreRecinto: '',
    municipioRecinto: '',
    viveCercaRecinto: false,
    experienciaEspecifica: '',
    nroDeProcesos: '',
    requisitos: {
      esBoliviano: false,
      registradoPadronElectoral: false,
      cedulaIdentidadVigente: false,
      disponibilidadTiempoCompleto: false,
      celularConCamara: false,
      android8_2OSuperior: false,
      lineaEntel: false,
      ningunaMilitanciaPolitica: false,
      sinConflictosInstitucion: false,
      cuentaConPowerBank: false,
    },
    archivo_ci: null,
    archivo_no_militancia: null,
    curriculum: null,
    capturaPantalla: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stateToSave = {
      currentStep,
      verificationData,
      formData: {
        ...formData,
        archivo_ci: serializeFile(formData.archivo_ci),
        archivo_no_militancia: serializeFile(formData.archivo_no_militancia),
        curriculum: serializeFile(formData.curriculum),
        capturaPantalla: serializeFile(formData.capturaPantalla),
      }
    };
    localStorage.setItem('applicantRegistrationData', JSON.stringify(stateToSave));
  }, [currentStep, verificationData, formData]);

  const handleNewRegistration = () => {
    localStorage.removeItem('applicantRegistrationData');
    setCurrentStep('verification');
    setVerificationData({
      cedula_identidad: '',
      complemento: '',
      expedicion: ''
    });
    setFormData({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      gradoInstruccion: '',
      carrera: '',
      ciudad: '',
      zona: '',
      calleAvenida: '',
      numeroDomicilio: '',
      email: '',
      celular: '',
      marcaCelular: '',
      modeloCelular: '',
      tipoPostulacion: '',
      idRecinto: '',
      nombreRecinto: '',
      municipioRecinto: '',
      viveCercaRecinto: false,
      experienciaEspecifica: '',
      nroDeProcesos: '',
      requisitos: {
        esBoliviano: false,
        registradoPadronElectoral: false,
        cedulaIdentidadVigente: false,
        disponibilidadTiempoCompleto: false,
        celularConCamara: false,
        android8_2OSuperior: false,
        lineaEntel: false,
        ningunaMilitanciaPolitica: false,
        sinConflictosInstitucion: false,
        cuentaConPowerBank: false,
      },
      archivo_ci: null,
      archivo_no_militancia: null,
      curriculum: null,
      capturaPantalla: null,
    });
    setMessage({ type: 'success', text: 'Formulario reiniciado para nuevo registro.' });
  };

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const validateField = (name: string, value: string | boolean | File | null): string => {
    switch (name) {
      case 'cedula_identidad':
        if (!value || typeof value !== 'string') return 'La cédula de identidad es requerida';
        if (!/^\d{4,9}$/.test(value)) return 'La cédula debe tener entre 4 y 9 dígitos';        
        break;
      case 'expedicion':
        if (!value) return 'La expedición es requerida';
        break;
      case 'nombre':
        if (!value || typeof value !== 'string') return 'El nombre es requerido';
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(value)) return 'Solo se permiten letras';
        break;
      case 'fechaNacimiento':
        if (!value || typeof value !== 'string') return 'La fecha de nacimiento es requerida';
        const birthDate = new Date(value);
        const cutoffDate = new Date('2007-08-17');
        if (birthDate > cutoffDate) return 'Debe ser mayor de edad';
        break;
      case 'gradoInstruccion':
        if (!value) return 'El grado de instrucción es requerido';
        break;
      case 'ciudad':
      case 'zona':
      case 'calleAvenida':
        if (!value || typeof value !== 'string') return 'Este campo es requerido';
        if (/^[^A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]+$/.test(value)) return 'No se permiten símbolos.';
        break;
      case 'numeroDomicilio':
        if (!value || typeof value !== 'string') return 'El número de domicilio es requerido';
        if (!/^[A-Z0-9]{1,5}$/.test(value)) {return 'Solo letras mayúsculas, números y espacios (máximo 5 caracteres)';}        
        break;
      case 'email':
        if (!value || typeof value !== 'string') return 'El email es requerido';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Formato de email inválido';
        break;
      case 'celular':
        if (!value || typeof value !== 'string') return 'El celular es requerido';
        if (!/^[6-7]\d{7}$/.test(value)) return 'Formato inválido (debe comenzar con 6 o 7 y tener 8 dígitos)';
        break;
      case 'tipoPostulacion':
      case 'idRecinto':
      case 'nombreRecinto':
      case 'municipioRecinto':
      case 'experienciaEspecifica':
        if (!value) return 'Este campo es requerido';
        break;
      case 'idRecinto':
        if (!value || typeof value !== 'string') return 'El ID del recinto es requerido';
        if (!/^\d{1}-\d{4}-\d{5}$/.test(value)) return 'Formato inválido (X-XXXX-XXXXX)';
        break;
      case 'archivo_ci':
      case 'curriculum':
          if (!value) return 'Este archivo es requerido';
          if (value instanceof File) {
            if (value.size > 3* (1024 * 1024)) return 'El archivo no debe superar 3MB';
            if (value.type !== 'application/pdf') {
              return 'Formato no permitido. Solo se acepta archivo PDF';
            }
          }
          break;
      case 'archivo_no_militancia':
      case 'capturaPantalla':
          if (!value) return 'Este archivo es requerido';
          if (value instanceof File) {
            if (value.size > 3*(1024 * 1024)) return 'El archivo no debe superar 3MB';
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedImageTypes.includes(value.type)) {
              return 'Formato no permitido. Solo se aceptan archivos JPG, JPEG o PNG';
            }
          }
          break;                 
    }
    return '';
  };

  const handleInputChange = (name: string, value: string | boolean | File | null) => {
    if (name.startsWith('requisitos.')) {
      const reqName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        requisitos: {
          ...prev.requisitos,
          [reqName]: value as boolean
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const ci = verificationData.cedula_identidad;
  
    if (!ci || typeof ci !== 'string') {
      showMessage('error', 'La cédula de identidad es requerida.');
      return;
    }
  
    if (!/^\d{4,9}$/.test(ci)) {
      showMessage('error', 'La cédula debe tener entre 4 y 9 dígitos numéricos.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const params = new URLSearchParams({
        cedula_identidad: ci,
        complemento: verificationData.complemento,
        expedicion: verificationData.expedicion
      });
  
      const response = await fetch(`http://34.176.125.198:8000/api/postulantes/existe?${params}`);
      const result = await response.json();
  
      if (result.success) {
        if (result.existe) {
          showMessage('error', 'El postulante ya está registrado.');
        } else {
          showMessage('success', 'Postulante no registrado. Puede proceder con el registro.');
          setCurrentStep('registration');
        }
      } else {
        showMessage('error', 'Error al verificar el postulante.');
      }
    } catch (error) {
      showMessage('error', 'Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'requisitos') {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      showMessage('error', 'Por favor corrija los errores en el formulario.');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'requisitos') {
          formDataToSend.append('requisitos', JSON.stringify(value));
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      formDataToSend.append('cedulaIdentidad', verificationData.cedula_identidad);
      formDataToSend.append('complemento', verificationData.complemento);
      formDataToSend.append('expedicion', verificationData.expedicion);

      const experiencia_general = formData.experienciaEspecifica === 'SI' 
        ? (formData.nroDeProcesos === '10' ? 10 : parseInt(formData.nroDeProcesos) || 0)
        : 0;
      formDataToSend.append('experiencia_general', experiencia_general.toString());

      const response = await fetch('http://34.176.125.198:8000/api/postulantes', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        if (result.success && result.pdfUrl) {
          const pdfFilename = `comprobante_${verificationData.cedula_identidad}.pdf`;
          
          const pdfResponse = await fetch(`http://34.176.125.198:8000${result.pdfUrl}`);
          if (!pdfResponse.ok) {
            throw new Error('Error al descargar el PDF');
          }
          
          const blob = await pdfResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = pdfFilename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          showMessage('success', 'Registro exitoso. Descargando comprobante...');
        } else {
          showMessage('error', result.message || 'Error al registrar el postulante');
        }
      } else if (contentType && contentType.includes('application/pdf')) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comprobante_${verificationData.cedula_identidad}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showMessage('success', 'Registro exitoso. Descargando comprobante...');
      } else {
        throw new Error('Tipo de respuesta no reconocido');
      }

      setTimeout(() => {
        handleNewRegistration();
      }, 10000);
    } catch (error) {
      console.error('Error en el registro:', error);
      showMessage('error', error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.experienciaEspecifica === 'NO') {
      setFormData(prev => ({ ...prev, nroDeProcesos: '' }));
    }
  }, [formData.experienciaEspecifica]);

  useEffect(() => {
    if (!formData.gradoInstruccion || formData.gradoInstruccion === 'BACHILLER') {
      setFormData(prev => ({ ...prev, carrera: '' }));
    }
  }, [formData.gradoInstruccion]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-white rounded-lg shadow-lg w-full">
            <div className="bg-blue-600 text-white p-6 rounded-t-lg flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Registro de Postulantes OPERADORES RURALES
                </h1>
                <p className="text-blue-100 mt-2">
                  Complete el formulario para registrarse como postulante
                </p>
              </div>
              {currentStep === 'registration' && (
                <button
                  onClick={handleNewRegistration}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  Nuevo Registro
                </button>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {currentStep === 'verification' && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'><div></div><div className="flex justify-center"><img src="logoOEP.png" className="h-15" /></div><div></div></div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Search className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Verificar Postulante</h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>IMPORTANTE:</strong> La postulación solo se puede realizar UNA SOLA VEZ. 
                  Verifique que los datos introducidos sean correctos.
                </p>
              </div>

              <form onSubmit={handleVerification} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cédula de Identidad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={verificationData.cedula_identidad}
                      onChange={(e) => setVerificationData(prev => ({ 
                        ...prev, 
                        cedula_identidad: e.target.value.replace(/\D/g, '').slice(0, 9) 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: 1234567"
                      maxLength={9}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={verificationData.complemento}
                      onChange={(e) => setVerificationData(prev => ({ 
                        ...prev, 
                        complemento: e.target.value.toUpperCase() 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: 1A"
                      maxLength={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expedición <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={verificationData.expedicion}
                      onChange={(e) => setVerificationData(prev => ({ 
                        ...prev, 
                        expedicion: e.target.value 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="LP">LP - La Paz</option>
                      <option value="CB">CB - Cochabamba</option>
                      <option value="SC">SC - Santa Cruz</option>
                      <option value="OR">OR - Oruro</option>
                      <option value="PT">PT - Potosí</option>
                      <option value="TJ">TJ - Tarija</option>
                      <option value="CH">CH - Chuquisaca</option>
                      <option value="BN">BN - Beni</option>
                      <option value="PD">PD - Pando</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Verificar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentStep === 'registration' && (
          <form onSubmit={handleRegistration} className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Datos Personales</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, ''))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    value={formData.apellidoPaterno}
                    onChange={(e) => handleInputChange('apellidoPaterno', e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, ''))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    value={formData.apellidoMaterno}
                    onChange={(e) => handleInputChange('apellidoMaterno', e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, ''))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                    max="2007-08-17"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado de Instrucción <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gradoInstruccion}
                    onChange={(e) => handleInputChange('gradoInstruccion', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.gradoInstruccion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="BACHILLER">BACHILLER</option>
                    <option value="TECNICO MEDIO">TECNICO MEDIO</option>
                    <option value="TECNICO SUPERIOR">TECNICO SUPERIOR</option>
                    <option value="UNIVERSITARIO">UNIVERSITARIO</option>
                    <option value="LICENCIATURA">LICENCIATURA</option>
                  </select>
                  {errors.gradoInstruccion && <p className="text-red-500 text-xs mt-1">{errors.gradoInstruccion}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrera
                  </label>
                  <input
                    type="text"
                    value={formData.carrera}
                    onChange={(e) => handleInputChange('carrera', e.target.value)}
                    disabled={!formData.gradoInstruccion || formData.gradoInstruccion === 'BACHILLER'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Home className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Dirección</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]/g, ''))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.ciudad ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.zona}
                    onChange={(e) => handleInputChange('zona', e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]/g, ''))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.zona ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.zona && <p className="text-red-500 text-xs mt-1">{errors.zona}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calle/Avenida <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.calleAvenida}
                    onChange={(e) => handleInputChange('calleAvenida', e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]/g, ''))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.calleAvenida ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.calleAvenida && <p className="text-red-500 text-xs mt-1">{errors.calleAvenida}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Domicilio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.numeroDomicilio}
                    onChange={(e) => {
                      const inputValue = e.target.value
                        .toUpperCase()
                        .replace(/[^A-ZÁÉÍÓÚÑ0-9\s]/g, '')
                        .slice(0, 5);

                      handleInputChange('numeroDomicilio', inputValue);
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.numeroDomicilio ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={5}
                    required
                  />
                  {errors.numeroDomicilio && <p className="text-red-500 text-xs mt-1">{errors.numeroDomicilio}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Phone className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Contacto</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celular <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.celular}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                      if (value.length > 0 && !/^[6-7]/.test(value)) {
                        showMessage('error', 'El celular debe comenzar con 6 o 7');
                        return;
                      }
                      handleInputChange('celular', value);
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.celular ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="60000000"
                    maxLength={8}
                    required
                  />
                  {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Dispositivo Móvil</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca del Celular
                  </label>
                  <input
                    type="text"
                    value={formData.marcaCelular}
                    onChange={(e) => handleInputChange('marcaCelular', e.target.value.slice(0, 30))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={30}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo del Celular
                  </label>
                  <input
                    type="text"
                    value={formData.modeloCelular}
                    onChange={(e) => handleInputChange('modeloCelular', e.target.value.slice(0, 30))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={30}
                  />
                </div>
              </div>
            </div>


            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Requisitos</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.requisitos).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={(e) => handleInputChange(`requisitos.${key}`, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={key} className="text-sm text-gray-700">
                      {key === 'esBoliviano' && 'Ser Boliviano'}
                      {key === 'registradoPadronElectoral' && 'Estar registrado en el padrón electoral'}
                      {key === 'cedulaIdentidadVigente' && 'Contar con CI vigente'}
                      {key === 'disponibilidadTiempoCompleto' && 'Disponibilidad tiempo completo'}
                      {key === 'celularConCamara' && 'No contar con sentencia ejecutoriadas'}
                      {key === 'android8_2OSuperior' && 'Contar con celular con Android 8.2 o superior'}
                      {key === 'lineaEntel' && 'Contar con línea Entel'}
                      {key === 'ningunaMilitanciaPolitica' && 'No contar con militancia política'}
                      {key === 'sinConflictosInstitucion' && 'Sin conflictos con la institución'}
                      {key === 'cuentaConPowerBank' && 'Contar con PowerBank (Bateria Externa)'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Documentación</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-100 rounded-lg shadow">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Archivo CI <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Cédula de identidad Anverso y Reverso (Solo PDF Max: 3MB)
                  </p>
                  <img src="/ci.jpg" className="h-[150px] object-contain mb-2" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleInputChange('archivo_ci', e.target.files?.[0] || null)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.archivo_ci ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.archivo_ci && <p className="text-red-500 text-xs mt-1">{errors.archivo_ci}</p>}
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No Militancia <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Captura de pantalla (Yo Participo) No tener Militancia Política(Solo JPG, JPEG o PNG. Max: 3MB)
                  </p>
                  <img src="/yoparticipo.png" className="h-[150px] object-contain mb-2" />
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handleInputChange('archivo_no_militancia', e.target.files?.[0] || null)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.archivo_no_militancia ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.archivo_no_militancia && (
                    <p className="text-red-500 text-xs mt-1">{errors.archivo_no_militancia}</p>
                  )}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg shadow">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hoja de Vida <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Hoja De Vida No Documentada (Solo PDF Max: 3MB)
                  </p>
                  <img src="/cv.jpg" className="h-[150px] object-contain mb-2" />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleInputChange('curriculum', e.target.files?.[0] || null)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.curriculum ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.curriculum && <p className="text-red-500 text-xs mt-1">{errors.curriculum}</p>}
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Captura Celular <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Captura de Pantalla CARACTERISTICAS DEL EQUIPO CELULAR (Solo JPG, JPEG o PNG. Max: 3MB)
                  </p>
                  <img src="/android.jpg" className="h-[350px] object-contain mb-2" />
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handleInputChange('capturaPantalla', e.target.files?.[0] || null)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.capturaPantalla ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.capturaPantalla && (
                    <p className="text-red-500 text-xs mt-1">{errors.capturaPantalla}</p>
                  )}
                </div>

                    <div className="p-4 bg-gray-100 rounded-lg shadow">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      Certificado Beneficiario SIGEP <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Certificado Registro Beneficiario SIGEP (Solo PDF Max: 3MB) 
                      <br />
                      <a href="https://www.youtube.com/watch?v=LBvJg1ftFmM">Ver Video Tutorial Apertura SIGEP Beneficiario</a>
                    </p>
                    <img src="/sigep.png" className="h-[150px] object-contain mb-2" />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleInputChange('archivo_sigep', e.target.files?.[0] || null)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.archivo_sigep ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.archivo_sigep && <p className="text-red-500 text-xs mt-1">{errors.archivo_sigep}</p>}
                  </div>

              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Experiencia Laboral</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Cuenta con experiencia en procesos electorales? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.experienciaEspecifica}
                    onChange={(e) => handleInputChange('experienciaEspecifica', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.experienciaEspecifica ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="SI">SÍ</option>
                    <option value="NO">NO</option>
                  </select>
                  {errors.experienciaEspecifica && <p className="text-red-500 text-xs mt-1">{errors.experienciaEspecifica}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de procesos en los que participó
                  </label>
                  <select
                    value={formData.nroDeProcesos}
                    onChange={(e) => handleInputChange('nroDeProcesos', e.target.value)}
                    disabled={formData.experienciaEspecifica !== 'SI'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Seleccione...</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <option key={num} value={num.toString()}>{num}</option>
                    ))}
                    <option value="10">10 o más procesos</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('verification');
                  setFormData({
                    nombre: '',
                    apellidoPaterno: '',
                    apellidoMaterno: '',
                    fechaNacimiento: '',
                    gradoInstruccion: '',
                    carrera: '',
                    ciudad: '',
                    zona: '',
                    calleAvenida: '',
                    numeroDomicilio: '',
                    email: '',
                    celular: '',
                    marcaCelular: '',
                    modeloCelular: '',
                    tipoPostulacion: '',
                    idRecinto: '',
                    nombreRecinto: '',
                    municipioRecinto: '',
                    viveCercaRecinto: false,
                    experienciaEspecifica: '',
                    nroDeProcesos: '',
                    requisitos: {
                      esBoliviano: false,
                      registradoPadronElectoral: false,
                      cedulaIdentidadVigente: false,
                      disponibilidadTiempoCompleto: false,
                      celularConCamara: false,
                      android8_2OSuperior: false,
                      lineaEntel: false,
                      ningunaMilitanciaPolitica: false,
                      sinConflictosInstitucion: false,
                      cuentaConPowerBank: false,
                    },
                    archivo_ci: null,
                    archivo_no_militancia: null,
                    curriculum: null,
                    capturaPantalla: null,
                  });
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Registrar Postulante
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicantRegistration;