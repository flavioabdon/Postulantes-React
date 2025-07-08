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
  Download
} from 'lucide-react';

interface VerificationData {
  cedula_identidad: string;
  complemento: string;
  expedicion: string;
}

interface ApplicantData {
  // Personal data
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  gradoInstruccion: string;
  carrera: string;
  // Address
  ciudad: string;
  zona: string;
  calleAvenida: string;
  numeroDomicilio: string;
  // Contact
  email: string;
  celular: string;
  // Mobile device
  marcaCelular: string;
  modeloCelular: string;
  // Electoral center
  tipoPostulacion: string;
  idRecinto: string;
  nombreRecinto: string;
  municipioRecinto: string;
  viveCercaRecinto: boolean;
  // Experience
  experienciaEspecifica: string;
  nroDeProcesos: string;
  // Requirements
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
  // Files
  archivo_ci: File | null;
  archivo_no_militancia: File | null;
  curriculum: File | null;
  capturaPantalla: File | null;
}

const ApplicantRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'verification' | 'registration'>('verification');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Verification form data
  const [verificationData, setVerificationData] = useState<VerificationData>({
    cedula_identidad: '',
    complemento: '',
    expedicion: ''
  });

  // Registration form data
  const [formData, setFormData] = useState<ApplicantData>({
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

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Show message with auto-hide
  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Validate field
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
        const cutoffDate = new Date('2005-08-17');
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
              if (value.size > 1024 * 1024) return 'El archivo no debe superar 1MB';
              if (value.type !== 'application/pdf') {
                return 'Formato no permitido. Solo se acepta archivo PDF';
              }
            }
            break;
          
        case 'archivo_no_militancia':
        case 'capturaPantalla':
            if (!value) return 'Este archivo es requerido';
            if (value instanceof File) {
              if (value.size > 1024 * 1024) return 'El archivo no debe superar 1MB';
              const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
              if (!allowedImageTypes.includes(value.type)) {
                return 'Formato no permitido. Solo se aceptan archivos JPG, JPEG o PNG';
              }
            }
            break;                 
    }
    return '';
  };

  // Handle input change with validation
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

    // Real-time validation
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Handle verification
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const ci = verificationData.cedula_identidad;
  
    // Validación local antes de continuar
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
  

  // Handle registration
// Handle registration
const handleRegistration = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  // Validate all fields
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
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'requisitos') {
        formDataToSend.append('requisitos', JSON.stringify(value));
      } else if (value instanceof File) {
        formDataToSend.append(key, value);
      } else {
        formDataToSend.append(key, String(value));
      }
    });

    // Add verification data
    formDataToSend.append('cedulaIdentidad', verificationData.cedula_identidad);
    formDataToSend.append('complemento', verificationData.complemento);
    formDataToSend.append('expedicion', verificationData.expedicion);

    // Calculate experience
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

    // Verificar el tipo de contenido
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // Manejar respuesta JSON con URL del PDF
      const result = await response.json();
      
      if (result.success && result.pdfUrl) {
        // Construir el nombre del archivo con el formato correcto
        const pdfFilename = `comprobante_${verificationData.cedula_identidad}.pdf`;
        
        // Descargar el PDF desde la URL proporcionada
        const pdfResponse = await fetch(`http://34.176.125.198:8000${result.pdfUrl}`);
        if (!pdfResponse.ok) {
          throw new Error('Error al descargar el PDF');
        }
        
        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfFilename; // Usamos el nombre con el formato correcto
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showMessage('success', 'Registro exitoso. Descargando comprobante...');
      } else {
        showMessage('error', result.message || 'Error al registrar el postulante');
      }
    } else if (contentType && contentType.includes('application/pdf')) {
      // Manejar respuesta directa de PDF (backup)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprobante_${verificationData.cedula_identidad}.pdf`; // Formato correcto
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showMessage('success', 'Registro exitoso. Descargando comprobante...');
    } else {
      throw new Error('Tipo de respuesta no reconocido');
    }

    // Reset form after delay
    setTimeout(() => {
      setCurrentStep('verification');
      setVerificationData({ cedula_identidad: '', complemento: '', expedicion: '' });
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
    }, 3000);
  } catch (error) {
    console.error('Error en el registro:', error);
    showMessage('error', error instanceof Error ? error.message : String(error));
  } finally {
    setIsLoading(false);
  }
};
  // Enable/disable number of processes select
  useEffect(() => {
    if (formData.experienciaEspecifica === 'NO') {
      setFormData(prev => ({ ...prev, nroDeProcesos: '' }));
    }
  }, [formData.experienciaEspecifica]);

  // Enable/disable career field
  useEffect(() => {
    if (!formData.gradoInstruccion || formData.gradoInstruccion === 'BACHILLER') {
      setFormData(prev => ({ ...prev, carrera: '' }));
    }
  }, [formData.gradoInstruccion]);

  return (
    
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Registro de Postulante
            </h1>
            <p className="text-blue-100 mt-2">
              Complete el formulario para registrarse como postulante
            </p>
          </div>
        </div>
        {/* Message */}
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

        {/* Verification Form */}
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

        {/* Registration Form */}
        {currentStep === 'registration' && (
          <form onSubmit={handleRegistration} className="space-y-6">
            {/* Personal Data */}
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
                    max="2005-08-17"
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

            {/* Address */}
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

            {/* Contact */}
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

            {/* Mobile Device */}
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

            {/* Electoral Center */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Recinto Electoral</h3>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <img src="/recinto.jpg" className="h-150 object-contain" />
                <p className="text-sm text-blue-800 mb-2">
                  En el mapa seleccione el recinto en el cual desea postular para operador SIREPRE excepto aquellos recintos RESTRINGIDO (Cárceles)
                </p>
                <a
                  href="https://www.google.com/maps/d/edit?mid=1LKoP7ACvqE5ZcDLJ4pz7Hl3JNpTUrcs&usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Building className="w-4 h-4" />
                  Abrir Mapa de Recintos
                </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Postulación <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tipoPostulacion}
                    onChange={(e) => handleInputChange('tipoPostulacion', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.tipoPostulacion ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="OPERADOR DE TRANSMISION SIREPRE URBANO">OPERADOR DE TRANSMISIÓN SIREPRE URBANO</option>
                    <option value="OPERADOR DE TRANSMISION SIREPRE PROVINCIA">OPERADOR DE TRANSMISIÓN SIREPRE PROVINCIA</option>
                  </select>
                  {errors.tipoPostulacion && <p className="text-red-500 text-xs mt-1">{errors.tipoPostulacion}</p>}
                </div>
                
                <div>
                  <div>
                    <img src="/recinto.jpg,," alt="" />
                  </div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Recinto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.idRecinto}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9-]/g, '');
                      if (value.length > 1 && value.charAt(1) !== '-') {
                        value = value.substring(0, 1) + '-' + value.substring(1);
                      }
                      if (value.length > 6 && value.charAt(6) !== '-') {
                        value = value.substring(0, 6) + '-' + value.substring(6);
                      }
                      if (value.length > 12) {
                        value = value.substring(0, 12);
                      }
                      handleInputChange('idRecinto', value);
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.idRecinto ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="X-XXXX-XXXXX"
                    maxLength={12}
                    required
                  />
                  {errors.idRecinto && <p className="text-red-500 text-xs mt-1">{errors.idRecinto}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Recinto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombreRecinto}
                    onChange={(e) => handleInputChange('nombreRecinto', e.target.value.slice(0, 250))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.nombreRecinto ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={250}
                    required
                  />
                  {errors.nombreRecinto && <p className="text-red-500 text-xs mt-1">{errors.nombreRecinto}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Municipio del Recinto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.municipioRecinto}
                    onChange={(e) => handleInputChange('municipioRecinto', e.target.value.slice(0, 250))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.municipioRecinto ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={250}
                    required
                  />
                  {errors.municipioRecinto && <p className="text-red-500 text-xs mt-1">{errors.municipioRecinto}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ¿Vive cerca del recinto? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.viveCercaRecinto.toString()}
                    onChange={(e) => handleInputChange('viveCercaRecinto', e.target.value === 'true')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Requirements */}
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
                      {key === 'esBoliviano' && 'Es boliviano'}
                      {key === 'registradoPadronElectoral' && 'Registrado en padrón electoral'}
                      {key === 'cedulaIdentidadVigente' && 'CI vigente'}
                      {key === 'disponibilidadTiempoCompleto' && 'Disponibilidad tiempo completo'}
                      {key === 'celularConCamara' && 'Celular con cámara'}
                      {key === 'android8_2OSuperior' && 'Android 8.2 o superior'}
                      {key === 'lineaEntel' && 'Línea Entel'}
                      {key === 'ningunaMilitanciaPolitica' && 'Ninguna militancia política'}
                      {key === 'sinConflictosInstitucion' && 'Sin conflictos con la institución'}
                      {key === 'cuentaConPowerBank' && 'Cuenta con Power Bank'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentation */}
            <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Documentación</h3>
            </div>
            
            <div className="space-y-6">
            {/* Sección 1: Archivo CI */}
            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Archivo CI <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Cédula de identidad Anverso y Reverso (Solo PDF Max: 1MB)
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

            {/* Sección 2: No Militancia */}
            <div className="p-4 bg-white rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No Militancia <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Captura de pantalla No Tener Militancia Política (Solo JPG, JPEG o PNG. Max: 1MB)
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

            {/* Sección 3: Hoja de Vida */}
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hoja de Vida <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Hoja De Vida No Documentada (Solo PDF Max: 1MB)
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

            {/* Sección 4: Captura Celular */}
            <div className="p-4 bg-white rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Captura Celular <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Captura de Pantalla CARACTERISTICAS DEL EQUIPO CELULAR (Solo JPG, JPEG o PNG. Max: 1MB)
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
          </div>
          </div>


            {/* Experience */}
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

            {/* Submit Buttons */}
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